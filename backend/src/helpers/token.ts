import { Request, Response } from "express";
import pool from "../connection/database";
import { RowDataPacket } from "mysql2";
import { Role } from "../types/role";
import { ReqUser } from "../types/account_info.types";
import { generateAuthToken, generateRefreshToken } from "./jwt";
import { setCookie } from "./cookie";

export async function getUserWithRefreshToken(req: Request, res: Response) {
  const connection = await pool.getConnection();
  const { refreshToken } = req.cookies;

  if (!refreshToken) return null;

  try {
    await connection.beginTransaction();
    // get user_id, email, and account_id through refresh token
    const [result] = await connection.query<RowDataPacket[]>(
      "SELECT rt.user_id, a.email, a.account_id, rt.expired_at, rt.token FROM refresh_token AS rt INNER JOIN account AS a ON a.user_id = rt.user_id WHERE token = ?",
      [refreshToken]
    );

    // if no user found with the refresh token, throw error
    if (result.length <= 0) return null;

    // get the role of the user
    const [roleResult] = await connection.query<
      ({ role: Role } & RowDataPacket)[]
    >(
      "SELECT r.role_name FROM user_role AS ur INNER JOIN role as r ON r.role_id = ur.role_id WHERE ur.user_id = ?",
      [result[0].user_id]
    );

    // create the user object that will be used to sign the new auth token
    const user: ReqUser = {
      email: result[0].email,
      user_id: result[0].user_id,
      account_id: result[0].account_id,
      isAdmin:
        roleResult[0].role_name === "admin" ||
        roleResult[0].role_name === "super_admin",
      role: roleResult[0].role_name,
    };

    console.log("Cookie refresh token:", req.cookies.refreshToken);
    console.log("DB refresh token:", result[0].token);

    const newRefreshToken = generateRefreshToken(user);

    // check if the refresh token is expired
    if (new Date(result[0].expired_at) < new Date()) {
      // if it's expired, delete the refresh token from the database and clear the cookie in the client
      await connection.query("DELETE FROM refresh_token WHERE token = ?", [
        refreshToken,
      ]);
      await connection.commit();
      res.clearCookie("refreshToken");
      return null;
    } else {
      // if it's not expired, update the expired_at field in the database
      const newExpiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
      await connection.query(
        "INSERT INTO refresh_token (user_id, token, expired_at) VALUES (?, ?, ?)",
        [result[0].user_id, newRefreshToken, newExpiredAt]
      );
    }

    const token = generateAuthToken(user);
    setCookie(res, "authToken", token, 1000 * 60 * 15);
    setCookie(res, "refreshToken", newRefreshToken, 1000 * 60 * 60 * 24 * 7);

    // commit the transaction
    await connection.commit();

    req.user = user;
    return user;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    if (connection) connection.release();
  }
}
