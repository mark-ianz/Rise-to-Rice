import { Response } from "express";

export function setCookie (res:Response, name: string, value: string, expires: number, options?: any) {
  res.cookie(name, value, {
    maxAge: expires,
    httpOnly: true,
    sameSite: "strict",
    ...options
  });
}

export function setAuthCookies(
  res: Response,
  authToken: string,
  refreshToken: string
) {
  res.clearCookie("refreshToken");
  setCookie(res, "refreshToken", refreshToken, 1000 * 60 * 60 * 24 * 7);
  setCookie(res, "authToken", authToken, 1000 * 60 * 15);
}
