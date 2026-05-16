import { Request, Response } from "express";
import pool from "../connection/database";
import { throwServerError } from "../helpers/errorHandlers";
import { getUserActivity, getUserActivityCount } from "../service/activity.service";

export async function handleGetUserActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { page, limit, type, search, status, startDate, endDate } = req.query;

    const pageInt = parseInt(page as string) || 1;
    const limitInt = parseInt(limit as string) || 10;
    const offset = (pageInt - 1) * limitInt;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID." });
      return;
    }

    const filters = {
      type: type as string,
      search: search as string,
      status: status ? (Array.isArray(status) ? status : [status]) as string[] : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
    };

    const total_items = await getUserActivityCount(pool, userId, filters);
    const result = await getUserActivity(pool, userId, limitInt, offset, filters);

    const hasNext = total_items > offset + limitInt;
    const hasPrev = pageInt > 1;

    res.status(200).json({
      result,
      page: pageInt,
      hasNext,
      hasPrev,
      total_items,
    });
  } catch (error) {
    console.error("Error in handleGetUserActivity:", error);
    throwServerError(res);
  }
}
