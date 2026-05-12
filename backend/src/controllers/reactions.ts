import { Request, Response } from "express";
import { Reaction, ReactionResponse, ReactionType } from "../schema/Reactions";
import pool from "../connection/database";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";

export async function handlePostReact(
  req: Request<{}, {}, Reaction>,
  res: Response
) {
  const { announcement_id, reaction } = req.body;

  const user_id = req.user?.user_id;

  if (!user_id || !announcement_id || !reaction) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO reactions (reaction, announcement_id, user_id) VALUES (?, ?, ?)",
    [reaction, announcement_id, user_id]
  );

  const insertedId = result.insertId;

  const [rows] = await pool.query<(ReactionResponse & RowDataPacket)[]>(
    "SELECT * FROM reactions WHERE reaction_id = ?",
    [insertedId]
  );

  res.status(201).json(rows[0]);
  return;
}

export async function handleGetReactions(
  req: Request<{ announcement_id: string }>,
  res: Response
) {
  const { announcement_id } = req.params;

  if (!announcement_id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [rows] = await pool.query(
    "SELECT * FROM reactions WHERE announcement_id = ?",
    [announcement_id]
  );

  res.status(200).json(rows);
  return;
}

export async function handleDeleteReaction(
  req: Request<{ reaction_id: string }>,
  res: Response
) {
  const { reaction_id } = req.params;

  if (!reaction_id) {
    res.status(400).json({ error: "Missing reaction ID." });
    return;
  }

  // Simulate deleting the reaction from a database
  await pool.query("DELETE FROM reactions WHERE reaction_id = ?", [
    reaction_id,
  ]);

  res.status(204).send(); // No content
  return;
}

export async function handleGetUsersWhoReacted(
  req: Request<
    { announcement_id: string },
    {},
    {},
    { reaction: ReactionType | "all" }
  >,
  res: Response
) {
  const { announcement_id } = req.params;
  const { reaction } = req.query;

  if (!announcement_id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // this logic is to get the users who reacted to a specific announcement
  // if the reaction is "all" then we get all users who reacted to that announcement
  // if the reaction is not "all" then we get the users who reacted with that specific reaction
  let query = `SELECT u.first_name, u.middle_name, u.last_name, u.suffix, u.user_id, r.reaction, r.timestamp 
      FROM reactions AS r
      LEFT JOIN user AS u 
      ON u.user_id = r.user_id
      WHERE r.announcement_id = ?`;
  const params = [announcement_id]

  if (reaction !== "all") {
    query += " AND r.reaction = ?";
    params.push(reaction);
  }

  const [rows] = await pool.query(query, params);

  res.status(200).json(rows);
  return;
}
