import { Response } from "express";

const cookieOptions = (): Record<string, unknown> => ({
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
});

export function setCookie (res:Response, name: string, value: string, expires: number, options?: any) {
  res.cookie(name, value, {
    maxAge: expires,
    ...cookieOptions(),
    ...options
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("authToken", cookieOptions());
  res.clearCookie("refreshToken", cookieOptions());
}

export function setAuthCookies(
  res: Response,
  authToken: string,
  refreshToken: string
) {
  const REFRESH_TOKEN_MAX_AGE = Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 7;
  const ACCESS_TOKEN_MAX_AGE = Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE) || 1000 * 60 * 15;
  clearAuthCookies(res);
  setCookie(res, "refreshToken", refreshToken, REFRESH_TOKEN_MAX_AGE);
  setCookie(res, "authToken", authToken, ACCESS_TOKEN_MAX_AGE);
}
