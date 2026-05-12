import { Request, Response } from "express";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import pool from "../connection/database";
import { RowDataPacket } from "mysql2";
import { z } from "zod";
import { LoginSchema } from "../schema/Login";
import { LoginError, login } from "../helpers/login";
import { authenticateRequest } from "../helpers/authentication";
import { deleteExpiredRefreshTokens } from "../helpers/token";
import { setAuthCookies } from "../helpers/cookie";

export async function loginUser(req: Request, res: Response) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // destructure data from the z validator
    const { email, password } = LoginSchema.parse(req.body);

    // login the user using a login helper function
    const loginResult = await login(connection, email, password);

    req.user = loginResult.user;
    setAuthCookies(res, loginResult.authToken, loginResult.refreshToken);

    // commit the transaction
    await connection.commit();

    res.json(req.user);
    return;
  } catch (error) {
    await connection.rollback();

    if (error instanceof z.ZodError) {
      handleZodErrors(error, res);
      return;
    }

    if (error instanceof LoginError) {
      res.status(error.statusCode).json(error.responseBody);
      return;
    }

    console.log(error);

    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
}

export async function logoutUser(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await deleteExpiredRefreshTokens(connection);

    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const [tokenResult] = await connection.query<
        ({ user_id: number } & RowDataPacket)[]
      >("SELECT user_id FROM refresh_token WHERE token = ?", [refreshToken]);

      if (tokenResult.length > 0) {
        await connection.query("DELETE FROM refresh_token WHERE user_id = ?", [
          tokenResult[0].user_id,
        ]);
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.log(error);
    throwServerError(res);
    return;
  } finally {
    if (connection) connection.release();
  }

  // clear the cookies
  res.clearCookie("authToken");
  res.clearCookie("refreshToken");
  req.user = undefined;

  res.json({ message: "Logged out successfully" });
}

export async function checkUser(
  req: Request,
  res: Response
) {
  const result = await authenticateRequest(req, res);

  if ("error" in result) {
    if (result.error === "missing_tokens") {
      res.status(401).json({ error: "No tokens provided" });
      return;
    }

    res.status(401).json({ error: "Unauthorized request" });
    return;
  }

  req.user = result.user;
  res.json(result.user);
  return;
}
