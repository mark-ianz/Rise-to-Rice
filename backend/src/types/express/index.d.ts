import { JwtPayload } from "jsonwebtoken";
import { ReqUser } from "../account_info.types";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser
    }
  }
}
