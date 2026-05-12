import { Request, Response } from "express";
import { LogExchange, LogExchangeSchema } from "../schema/LogExchange";
import pool from "../connection/database";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { saveToActionLog } from "../service/admin.service";
import { ZodError } from "zod";
import { manipulateUserPoints_service } from "../service/points.service";

export async function logExchange(
  req: Request<{}, {}, LogExchange>,
  res: Response
) {
  const connection = await pool.getConnection();

  const logged_by = req.user!.user_id;

  try {
    const { user_id, material_id, weight, points_added } =
      LogExchangeSchema.parse(req.body);

    await connection.beginTransaction();

    // insert exchange log
    await connection.query(
      "INSERT INTO exchange_log (user_id, logged_by, material_id, weight, points_added) VALUES (?, ?, ?, ?, ?)",
      [user_id, logged_by, material_id, weight, points_added]
    );

    // update user points
    await manipulateUserPoints_service(
      connection,
      "add_points",
      points_added,
      user_id
    );

    // save to action log
    saveToActionLog(connection, "exchange_log", logged_by, {
      user_id,
      material_id,
      weight,
      points_added,
    });

    await connection.commit();
    res.json({ message: "Exchange logged successfully." });
  } catch (error) {
    console.log(error);

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    await connection.rollback();
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }

  return;
}
