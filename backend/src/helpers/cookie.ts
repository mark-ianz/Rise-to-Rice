import { Response } from "express";

export function setCookie (res:Response, name: string, value: string, expires: number, options?: any) {
  res.cookie(name, value, {
    maxAge: expires,
    httpOnly: true,
    sameSite: "strict",
    ...options
  });
}