import { Request, Response } from "express";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import pool from "../connection/database";
import { z } from "zod";
import { LoginSchema } from "../schema/Login";
import { login } from "../helpers/login";
import jwt from "jsonwebtoken";
import { ReqUser } from "../types/account_info.types";
import { getUserWithRefreshToken } from "../helpers/token";

export async function loginUser(req: Request, res: Response) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // destructure data from the z validator
    const { email, password } = LoginSchema.parse(req.body);

    // login the user using a login helper function
    await login(connection, email, password, req, res);

    // commit the transaction
    await connection.commit();

    res.json(req.user);
    return;
  } catch (error) {
    console.log(error);

    await connection.rollback();

    if (error instanceof z.ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
}

export async function logoutUser(req: Request, res: Response) {
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
  // get the auth token from the cookies
  const { authToken, refreshToken } = req.cookies;

  // if there is no token, return an error
  if (!authToken && !refreshToken) {
    res.status(401).json({ error: "No tokens provided" });
    return;
  }

  if (authToken) {
    try {
      const decoded = jwt.verify(
        authToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as ReqUser;

      // destructure the iat and exp from the decoded token so that they won't be included in the response
      const { iat, exp, ...userData } = decoded;
      req.user = userData;
      res.json(userData);
      return;
    } catch (error) {
      if (!refreshToken) {
        res.status(401).json({ error: "Unauthorized request" });
        return;
      }
    }
  }

  const user = await getUserWithRefreshToken(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized request" });
    return;
  }

  req.user = user;
  res.json(user);
}
