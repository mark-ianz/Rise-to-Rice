import { Request, Response } from "express";
import pool from "../connection/database";
import { User } from "../types/account_info.types";
import { RowDataPacket } from "mysql2";
import { checkForPagination } from "../helpers/query";

export async function pagination(
  req: Request<{}, {}, {}, { page: string; limit: string }>,
  res: Response
) {
  const { page, limit } = req.query;

  const pagination = await checkForPagination(page, limit, "user", "user_id");

  if (!pagination) {
    res.status(400).json({ error: "Invalid page or limit.", pagination });
    return;
  }

  const [result] = await pool.query<(User & RowDataPacket)[]>(
    "SELECT * FROM user LIMIT ? OFFSET ?",
    [pagination.limitInt, pagination.offset]
  );

  res.json({
    result,
    page: pagination.pageInt,
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev,
  });
  return;
}
