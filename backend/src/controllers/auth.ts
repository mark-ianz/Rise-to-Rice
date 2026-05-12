import { Request, Response } from "express";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import pool from "../connection/database";
import { z } from "zod";
import { LoginSchema } from "../schema/Login";
import { login } from "../helpers/login";
import { authenticateRequest } from "../helpers/authentication";

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
