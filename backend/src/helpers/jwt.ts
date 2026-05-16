import { ReqUser } from "../types/account_info.types";
import jwt from "jsonwebtoken";

export function generateAuthToken(user: ReqUser) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: (process.env.ACCESS_TOKEN_JWT_EXPIRES_IN as any) || "15m",
  });
}

export function generateRefreshToken(user: ReqUser) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: (process.env.REFRESH_TOKEN_JWT_EXPIRES_IN as any) || "7d",
  });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as ReqUser;
  } catch (error) {
    return null;
  }
}