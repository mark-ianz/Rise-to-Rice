import { Request, Response } from "express";
import { getUserWithRefreshToken } from "../helpers/token";

export async function validateRefreshToken(
  req: Request,
  res: Response
) {
  const user = await getUserWithRefreshToken(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized request" });
    return;
  }

  res.json(user);
}
