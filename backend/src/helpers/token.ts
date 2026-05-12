import { Request, Response } from "express";
import pool from "../connection/database";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { Role } from "../types/role";
import { ReqUser } from "../types/account_info.types";
import { generateAuthToken, generateRefreshToken } from "./jwt";
import { setCookie } from "./cookie";

const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

export async function deleteExpiredRefreshTokens(connection: PoolConnection) {
  await connection.query("DELETE FROM refresh_token WHERE expired_at < NOW()");
}

export async function replaceUserRefreshToken(
  connection: PoolConnection,
  userId: number,
  refreshToken: string
) {
  await deleteExpiredRefreshTokens(connection);
  await connection.query("DELETE FROM refresh_token WHERE user_id = ?", [userId]);
  await connection.query(
    "INSERT INTO refresh_token (token, user_id, expired_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [refreshToken, userId]
  );
}

export async function getUserWithRefreshToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return null;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await deleteExpiredRefreshTokens(connection);

    // get user_id, email, and account_id through refresh token
    const [result] = await connection.query<RowDataPacket[]>(
      "SELECT rt.user_id, a.email, a.account_id, rt.expired_at, rt.token FROM refresh_token AS rt INNER JOIN account AS a ON a.user_id = rt.user_id WHERE token = ?",
      [refreshToken]
    );

    // if no user found with the refresh token, throw error
    if (result.length <= 0) {
      await connection.rollback();
      res.clearCookie("refreshToken");
      return null;
    }

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
      // Rotate the current refresh token instead of creating additional rows.
      await connection.query(
        "UPDATE refresh_token SET token = ?, expired_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE token = ?",
        [newRefreshToken, refreshToken]
      );
    }

    const token = generateAuthToken(user);
    setCookie(res, "authToken", token, 1000 * 60 * 15);
    setCookie(res, "refreshToken", newRefreshToken, REFRESH_TOKEN_MAX_AGE);

    // commit the transaction
    await connection.commit();

    req.user = user;
    return user;
  } catch (error) {
    await connection.rollback();
    console.log(error);
    return null;
  } finally {
    if (connection) connection.release();
  }
}
