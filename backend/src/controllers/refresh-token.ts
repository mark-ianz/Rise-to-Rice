import pool from "../connection/database";
import { RowDataPacket } from "mysql2";
import { Role } from "../types/role";
import { generateAuthToken } from "../helpers/jwt";
import { ReqUser } from "../types/account_info.types";
import { setCookie } from "../helpers/cookie";
import { throwServerError } from "../helpers/errorHandlers";
import { NextFunction, Request, Response } from "express";
import { getUserWithRefreshToken } from "../helpers/token";

export async function validateRefreshToken(
  req: Request,
  res: Response,
) {
  
  const user = await getUserWithRefreshToken(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized request" });
    return;
  }

  res.json(user);
}
