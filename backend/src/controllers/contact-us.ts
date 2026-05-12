import { Request, Response } from "express";
import { ContactUsResponse, ContactUsSchema } from "../schema/ContactUs";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { ZodError } from "zod";
import pool from "../connection/database";
import { PaginationParams } from "../types/params";
import { checkForPagination } from "../helpers/query";
import { RowDataPacket } from "mysql2";

export async function handlePostContactUs(req: Request, res: Response) {
  try {
    const { first_name, last_name, email, message } = ContactUsSchema.parse(
      req.body
    );

    await pool.query(
      "INSERT INTO contact (first_name, last_name, email, message) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, message]
    );

    res.status(201).json({ message: "Message sent successfully" });
    return;
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
    return;
  }
}

export async function handleGetAllContactMessages(
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
      "contact",
      "contact_id",
      whereClause
    );

    if (!pagination) {
      console.log("Invalid Pagination");
      res.status(400).json({ error: "Invalid pagination query." });
      return;
    }

    const [contacts] = await connection.query<
      (ContactUsResponse & RowDataPacket)[]
    >(
      `SELECT * FROM contact ${whereClause.statement} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`,
      [...whereClause.values, pagination.limitInt, pagination.offset]
    );

    res.status(200).json({
      result: contacts,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
    return;
  } catch (error) {
    await connection.rollback();
    console.log(error);
    throwServerError(res);
  } finally {
    connection.release();
  }
}

export async function handleContactMessageStatusUpdate(
  req: Request<{ id: string }, {}, { status: string }>,
  res: Response
) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "responded", "resolved"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  try {
    await pool.query(
      "UPDATE contact SET status = ?, updatedAt = ? WHERE contact_id = ?",
      [status, new Date(), id]
    );

    res.status(200).json({ message: "Status updated successfully" });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function handleContactMessageStatusUpdateDelete(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM contact WHERE contact_id = ?", [id]);

    res.status(200).json({ message: "Message deleted successfully" });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}
