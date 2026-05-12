import { Request, Response } from "express";
import {
  RewardVariation,
  RewardVariationSchema,
  RewardVariationUpdate,
  RewardVariationUpdateSchema,
} from "../schema/RewardVariation";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { ZodError } from "zod";
import pool from "../connection/database";
import { QueryResult } from "mysql2";

export async function handlePostRewardVariation(
  req: Request<{}, {}, RewardVariation>,
  res: Response
) {
  try {
    const parsedBody = RewardVariationSchema.parse(req.body);

    const { reward_id, quantity, points_cost } = parsedBody;

    // save to the database
    await pool.query(
      `INSERT INTO reward_variation (reward_id, quantity, points_cost) VALUES (?, ?, ?)`,
      [reward_id, quantity, points_cost]
    );

    res.json({ message: "Reward variation added successfully." });
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

export async function handleGetRewardVariation(
  req: Request<{ id?: string }>,
  res: Response
) {
  const { id } = req.params;
  try {
    const [rewardVariation] = await pool.query<RewardVariation[] & QueryResult>(
      // if id is provided, get the specific reward variation, else get all reward variations
      id
        ? `SELECT * FROM reward_variation WHERE reward_id = ?`
        : `SELECT * FROM reward_variation`,
      id ? [id] : []
    );

    const sortedByQuantity = rewardVariation.sort(
      (a: RewardVariation, b: RewardVariation) => a.quantity - b.quantity
    );

    // if id is provided, return the first element of the array, else return the whole array
    res.json(id ? sortedByQuantity : rewardVariation[0]);
    return;
  } catch (error) {
    throwServerError(res);
    return;
  }
}

export async function handleUpdateRewardVariation(
  req: Request<{ id: string }, {}, RewardVariationUpdate>,
  res: Response
) {
  try {
    const parsedBody = RewardVariationUpdateSchema.parse(req.body);
    const { id } = req.params;

    const { quantity, points_cost } = parsedBody;

    await pool.query(
      `UPDATE reward_variation SET quantity = ?, points_cost = ? WHERE variation_id = ?`,
      [quantity, points_cost, id]
    );

    res.json({ message: "Reward variation updated successfully." });
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

export async function handleDeleteRewardVariation(
  req: Request<{ id: string }>,
  res: Response
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    await connection.query(
      `UPDATE redeem_request SET variation_id = NULL WHERE variation_id = ?`,
      [id]
    );

    await connection.query(
      `DELETE FROM reward_variation WHERE variation_id = ?`,
      [id]
    );

    await connection.commit();

    res.json({ message: "Reward variation deleted successfully." });
    return;
  } catch (error) {
    await connection.rollback();
    console.log(error);
    throwServerError(res);
    return;
  } finally {
    connection.release();
  }
}
