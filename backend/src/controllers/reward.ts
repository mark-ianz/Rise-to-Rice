import { json, Request, Response } from "express";
import { Reward, RewardSchema } from "../schema/Reward";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { ZodError } from "zod";
import pool from "../connection/database";
import { PaginationParams } from "../types/params";
import { checkForPagination } from "../helpers/query";
import { getRewards, getSingleReward } from "../service/rewards.service";
import { RewardVariation } from "../types/reward-variation";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function handlePostReward(
  req: Request<{}, {}, Reward>,
  res: Response
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    // validate the request body
    const parsedBody = RewardSchema.parse(req.body);
    const { reward_name, unit } = parsedBody;

    // save the reward to the database
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO reward (reward_name, unit) VALUES (?, ?)`,
      [reward_name, unit]
    );

    const insertId = result.insertId;
    console.log(insertId);

    const inserted_reward = await getSingleReward(connection, insertId);

    console.log(inserted_reward);

    await connection.commit();

    res.status(200).json({
      ...inserted_reward,
      variations: JSON.parse(inserted_reward!.variations.toString()),
    });
    return;
  } catch (error) {
    console.log(error);
    await connection.rollback();
    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
    return;
  } finally {
    connection.release();
  }
}

export async function handleGetRewards(
  req: Request<{ id?: string }, {}, {}, PaginationParams>,
  res: Response
) {
  const { id } = req.params;
  const { page, limit, search, searchFor, isAdmin } = req.query;
  const whereClause = id
    ? { statement: "WHERE reward_id = ?", values: [id] }
    : { statement: "", values: [] };
  const parsedIsAdmin = isAdmin === "true" ? true : false;

  // if search is provided, add it to the where clause
  if (search && searchFor) {
    if (whereClause.statement) {
      whereClause.statement += ` AND ${searchFor} LIKE ?`;
    } else {
      whereClause.statement = `WHERE ${searchFor} LIKE ?`;
    }
    whereClause.values.push(`%${search}%`);
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const pagination = await checkForPagination(
      page,
      limit,
      "reward",
      "reward_id",
      whereClause
    );

    if (!pagination) {
      console.log("Invalid Pagination");
      res.status(400).json({ error: "Invalid pagination query." });
      return;
    }

    const result = await getRewards(
      pool,
      pagination?.limitInt,
      pagination?.offset,
      whereClause,
      parsedIsAdmin
    );
    const rewards = result.map((row) => ({
      ...row,
      variations: JSON.parse(row.variations.toString()), // Convert string to JSON array
    }));

    // if id is provided, return the first element of the array, else return the whole array
    res.status(200).json({
      result: id ? rewards[0] : rewards,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
    await connection.commit();
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    await connection.rollback();
    return;
  } finally {
    connection.release();
  }
}

export async function handleDeleteReward(
  req: Request<{ id: string }>,
  res: Response
) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    const [rewardVariations] = await connection.query<
      (RewardVariation & RowDataPacket)[]
    >(`SELECT * FROM reward_variation WHERE reward_id = ?`, [id]);

    // get all variation ids to delete redeem requests
    const variationIds = rewardVariations.map(
      (variation) => variation.variation_id
    );

    // delete all redeem requests that are related to this reward
    await connection.query(
      `DELETE FROM redeem_request WHERE variation_id IN (?)`,
      [variationIds.join(",")]
    );

    // delete all variations first
    await connection.query(`DELETE FROM reward_variation WHERE reward_id = ?`, [
      id,
    ]);

    await connection.query(`DELETE FROM reward WHERE reward_id = ?`, [id]);

    res.status(200).json({ message: "Reward successfully deleted." });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function handleUpdateReward(
  req: Request<{ id: string }, {}, Reward>,
  res: Response
) {
  try {
    const { id } = req.params;
    const parsedBody = RewardSchema.parse(req.body);
    const { reward_name, unit } = parsedBody;

    await pool.query(
      `UPDATE reward SET reward_name = ?, unit = ? WHERE reward_id = ?`,
      [reward_name, unit, id]
    );

    res.status(200).json({ message: "Reward successfully updated." });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
    return;
  }
}
