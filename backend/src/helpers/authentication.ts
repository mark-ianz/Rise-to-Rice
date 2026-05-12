import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserWithRefreshToken } from "./token";
import { ReqUser } from "../types/account_info.types";

type AuthenticationResult =
  | { user: ReqUser }
  | { error: "missing_tokens" | "unauthorized" };

export async function authenticateRequest(
  req: Request,
  res: Response
): Promise<AuthenticationResult> {
  const { authToken, refreshToken } = req.cookies;

  if (!authToken && !refreshToken) {
    return { error: "missing_tokens" };
  }

  if (authToken) {
    try {
      const decoded = jwt.verify(
        authToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as ReqUser;

      // Remove JWT metadata before attaching the authenticated user.
      const { iat, exp, ...userData } = decoded;
      return { user: userData };
    } catch (error) {
      if (!refreshToken) {
        return { error: "unauthorized" };
      }
    }
  }

  const user = await getUserWithRefreshToken(req, res);

  if (!user) {
    return { error: "unauthorized" };
  }

  return { user };
}
