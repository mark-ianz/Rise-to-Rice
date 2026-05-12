import { Request, Response } from "express";
import pool from "../connection/database";
import {
  handleZodErrors,
  isQueryError,
  throwServerError,
} from "../helpers/errorHandlers";
import { Material } from "../types/material";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { saveToActionLog } from "../service/admin.service";
import {
  AddMaterial,
  AddMaterialSchema,
  EditMaterialSchema,
} from "../schema/AddMaterial";
import { z } from "zod";
import { PaginationParams } from "../types/params";
import { checkForPagination } from "../helpers/query";
import { querySingleMaterial } from "../service/material.service";

export async function getAllMaterials(
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response
) {
  const { page, limit, search, searchFor } = req.query;

  const whereClause: { statement: string; values: string[] } = {
    statement: "",
    values: [],
  };

  // if search is provided, add it to the where clause
  if (search && searchFor) {
    whereClause.statement = `WHERE ${searchFor} LIKE ?`;
    whereClause.values.push(`%${search}%`);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const pagination = await checkForPagination(
      page,
      limit,
      "material",
      "material_id",
      whereClause
    );

    if (!pagination) {
      console.log("Invalid Pagination");
      res.status(400).json({ error: "Invalid pagination query." });
      return;
    }

    const [materials] = await pool.query<(Material & RowDataPacket)[]>(
      `SELECT * FROM material ${whereClause.statement} LIMIT ? OFFSET ?`,
      [...whereClause.values, pagination.limitInt, pagination.offset]
    );

    await connection.commit();

    res.status(200).json({
      result: materials,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
  } catch (error) {
    await connection.rollback();
    console.log(error);
    throwServerError(res);
  }

  connection.release();

  return;
}

export async function getAllCategories(req: Request, res: Response) {
  try {
    const [categories] = await pool.query("SELECT * FROM material_category");

    const [materials] = await pool.query("SELECT * FROM material");

    const data = (categories as any[]).map((category) => ({
      category: category.category,
      category_id: category.category_id,
      types: (materials as any[])
        .filter((material) => material.category_id === category.category_id)
        .map((material) => ({
          material: material.material,
          points_per_kg: material.points_per_kg,
          material_id: material.material_id,
        })),
    }));

    res.json(data);
  } catch (error) {
    console.error("Failed to fetch materials", error);
    throwServerError(res);
  }
  return;
}

export async function getSingleMaterial(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const material = await querySingleMaterial(pool, id);
    if (!material) {
      res.status(404).json({ message: "Material not found" });
      return;
    }

    res.json(material);
  } catch (error) {
    console.log(error);
    throwServerError(res);
  }
  return;
}

export async function addMaterial(
  req: Request<{}, {}, AddMaterial>,
  res: Response
) {
  const connection = await pool.getConnection();

  const performed_by = req.user!.user_id;
  try {
    const { material, points_per_kg, category_id } = AddMaterialSchema.parse(
      req.body
    );
    await connection.beginTransaction();

    // insert into material table
    const [materialRow] = await pool.query<ResultSetHeader>(
      "INSERT INTO material (category_id, material, points_per_kg) VALUES (?, ?, ?)",
      [category_id, material, points_per_kg]
    );

    saveToActionLog(connection, "add_material", performed_by, {
      material,
      points_per_kg,
    });

    if (!material) {
      res.status(404).json({ message: "Material not found" });
      return;
    }

    // get the material that was just inserted
    const new_material = await querySingleMaterial(pool, materialRow.insertId);

    await connection.commit();
    res.status(201).json(new_material);
  } catch (error) {
    console.log(error);
    // if there was an error, the query will rollback and won't save the previous query before error
    await connection.rollback();

    // check if zod error
    if (error instanceof z.ZodError) {
      handleZodErrors(error, res);
      return;
    }

    // check if duplicate error
    if (isQueryError(error) && error.code === "ER_DUP_ENTRY") {
      res
        .status(422)
        .json({ error: "Material name is already in the database" });
      return;
    }

    // throw server error if it's not zod error
    throwServerError(res);
  }
  return;
}

export async function updateMaterial(
  req: Request<{ id: string }, {}, AddMaterial>,
  res: Response
) {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    const { material, points_per_kg } = EditMaterialSchema.parse(req.body);
    await connection.query(
      "UPDATE material SET material = ?, points_per_kg = ? WHERE material_id = ?",
      [material, points_per_kg, id]
    );

    saveToActionLog(connection, "update_material", req.user!.user_id, {
      material,
      points_per_kg,
    });

    res.json({ message: "Material successfully updated" });
  } catch (error) {
    await connection.rollback();

    console.log(error);
    if (error instanceof z.ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
  return;
}

export async function deleteMaterial(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // get the material first before deleting it
    const [material] = await connection.query<(Material & RowDataPacket)[]>(
      "SELECT * FROM material WHERE material_id = ?",
      [id]
    );

    // if material is not found
    if (material.length === 0) {
      res.status(404).json({ message: "Material not found" });
      return;
    }

    // delete the data that are related to the material
    await connection.query("DELETE FROM exchange_log WHERE material_id = ?", [
      id,
    ]);

    // delete the material
    await connection.query("DELETE FROM material WHERE material_id = ?", [id]);

    // save to action log
    saveToActionLog(connection, "delete_material", req.user!.user_id, {
      material: material[0].material,
      points_per_kg: material[0].points_per_kg,
    });

    await connection.commit();
    res.json({ message: "Material deleted" });
  } catch (error) {
    await connection.rollback();
    console.log(error);
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
  return;
}

export async function addCategory(
  req: Request<{}, {}, { category: string }>,
  res: Response
) {
  const connection = await pool.getConnection();
  try {
    const { category } = req.body;
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO material_category (category) VALUES (?)",
      [category]
    );

    const category_id = result.insertId;
    const [categoryRow] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM material_category WHERE category_id = ?",
      [category_id]
    );

    res.status(201).json(categoryRow[0]);
  } catch (error) {
    console.log(error);
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
  return;
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // get the category first before deleting it
    const [category] = await connection.query<(Material & RowDataPacket)[]>(
      "SELECT * FROM material_category WHERE category_id = ?",
      [id]
    );

    // if category is not found
    if (category.length === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // delete the data that are related to the category
    await connection.query("DELETE FROM material WHERE category_id = ?", [id]);

    // delete the category
    await connection.query(
      "DELETE FROM material_category WHERE category_id = ?",
      [id]
    );

    // save to action log
    saveToActionLog(connection, "delete_material_category", req.user!.user_id, {
      category: category[0].category,
    });

    await connection.commit();
    res.json({ message: "Category deleted" });
  } catch (error) {
    await connection.rollback();
    console.log(error);
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
  return;
}
