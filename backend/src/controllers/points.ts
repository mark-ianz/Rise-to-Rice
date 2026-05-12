import { Request, Response } from "express";
import pool from "../connection/database";
import { Points, PointsQuery } from "../types/points";
import { saveToActionLog } from "../service/admin.service";
import { ManipulatePoints, ManipulatePointsSchema } from "../schema/Points";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { ZodError } from "zod";
import { manipulateUserPoints_service } from "../service/points.service";

async function getPoints(res: Response, id: number) {
  const [point] = await pool.query<PointsQuery>(
    "SELECT * FROM points WHERE user_id = ?",
    [id]
  );

  if (point.length === 0) {
    res.status(404).json({ errors: ["User points not found"] });
    return;
  }

  return point[0];
}

export async function getUserPoints(req: Request, res: Response) {
  const { id } = req.params;
  const points = await getPoints(res, parseInt(id));
  res.json(points);
  return;
}

export async function getMyPoints(req: Request, res: Response) {
  const { user_id } = req.user!;

  const [points] = await pool.query<PointsQuery>(
    "SELECT * FROM points WHERE user_id = ?",
    [user_id]
  );

  res.json(points[0]);
  return;
}

export async function manipulateUserPoints(
  req: Request<{}, {}, ManipulatePoints>,
  res: Response
) {
  const connection = await pool.getConnection();

  const { user_id: performed_by } = req.user!;

  try {
    const { user_id, points_to_manipulate, reason, manipulation_type } =
      ManipulatePointsSchema.parse(req.body);

    const action = manipulation_type === "add" ? "add_points" : "deduct_points";

    manipulateUserPoints_service(
      connection,
      action,
      points_to_manipulate,
      user_id
    );

    saveToActionLog(connection, action, performed_by, {
      user_id,
      points: points_to_manipulate,
      reason,
    });

    await connection.commit();

    res.json({
      message: `Points ${
        manipulation_type === "add" ? "added" : "deducted"
      } successfully`,
    });
  } catch (error) {
    console.log(error);
    await connection.rollback();

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
  }
  return;
}
