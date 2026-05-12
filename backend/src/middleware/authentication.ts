import { NextFunction, Request, Response } from "express";
import { authenticateRequest } from "../helpers/authentication";
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = await authenticateRequest(req, res);

  if ("error" in result) {
    res.status(401).json({ error: "Unauthorized request" });
    return;
  }

  req.user = result.user;
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

export function requireSelf(req: Request, res: Response, next: NextFunction) {
  if (req.user?.user_id.toString() !== req.params.id) {
    res.status(403).json({ error: "Forbidden request" });
    return;
  }

  next();
}
