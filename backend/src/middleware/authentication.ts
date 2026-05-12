import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ReqUser } from "../types/account_info.types";
import { getUserWithRefreshToken } from "../helpers/token";
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authToken, refreshToken } = req.cookies;

  if (!authToken && !refreshToken) {
    res.status(401).json({ error: "Unauthorized request" });
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
      next();
      return;
    } catch (err) {
      res.status(401).json({ error: "Unauthorized request" });
      return;
    }
  }

  const user = await getUserWithRefreshToken(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized request" });
    return;
  }

  req.user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: "Forbidden request" });
    return;
  }

  next();
}

export function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "super_admin") {
    res.status(403).json({ error: "Forbidden request" });
    return;
  }

  next();
}

// middleware that only allows either user with the same id as the parameter or admins
export function requireSelfOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.user_id.toString() !== req.params.id && !req.user?.isAdmin) {
    res.status(403).json({ error: "Forbidden request" });
    return;
  }

  next();
}