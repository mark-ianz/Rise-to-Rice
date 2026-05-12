import { NextFunction, Request, Response } from "express";
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
  res: Response,
) {
  // get the auth token from the cookies
  const { authToken, refreshToken } = req.cookies;

  // if there is no token, return an error
  if (!authToken && !refreshToken) {
    res.status(401).json({ error: "No tokens provided" });
    return;
  }

  // if authToken is present verify it and return the user data
  try {
    const decoded = jwt.verify(
      authToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as ReqUser;

    // destructure the iat and exp from the decoded token so that they won't be included in the response
    const { iat, exp, ...userData } = decoded;
    req.user = userData;
    res.json(userData);
    console.log("Auth Token is still valid!");
    return;
  } catch (error) {
    console.log("Auth token is expired");
    // if the token is invalid, check if the refresh token is present
    if (!refreshToken) {
      console.log("No Refresh Token provided");
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // if there is no authToken but there is a refreshToken, call the getUserWithRefreshToken which will return the user data if the refresh token is valid
    const user = await getUserWithRefreshToken(req, res);

    if (!user) {
      res.status(401).json({ error: "Unauthorized request" });
      return;
    }

    res.json(user);
    return;
  }
}
