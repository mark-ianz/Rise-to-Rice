import { Request, Response } from "express";
import pool from "../connection/database";
import { Time } from "../types/material";
import { TimeSchema } from "../schema/Analytics";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { ZodError } from "zod";
import { getQueryDateFilter } from "../helpers/date";
import { RowDataPacket } from "mysql2";

export async function getMaterialsByTotalWeight(
  req: Request<{
    time?: Time;
  }>,
  res: Response
) {
  try {
    // destructure the time from parsed request params
    const { time, id } = TimeSchema.parse(req.params);

    // if the request is not made by an admin, and the id is not present, return a forbidden request
    // this ensures that only admins can view the analytics of all users
    // while users can only view their own analytics
    if (!id && req.user?.isAdmin) {
      res.status(403).json({ error: "Forbidden request" });
      return;
    }

    // switch case to determine the query_date_filter based on the time
    const query_date_filter = getQueryDateFilter(time);
    const whereClause = id
      ? `WHERE timestamp ${query_date_filter} AND user_id = ?`
      : `WHERE timestamp ${query_date_filter}`;

    const [rows] = await pool.query(
      `SELECT
        el.material_id,
        m.material,
        ROUND(SUM(el.points_added), 1) as total_points, 
        ROUND(SUM(el.weight), 1) AS total_weight,
        ROUND((SUM(el.weight) / SUM(SUM(el.weight)) OVER()) * 100, 1) AS weight_percentage
        FROM exchange_log as el
        INNER JOIN material as m ON el.material_id = m.material_id
        ${whereClause}
        GROUP BY material_id 
        ORDER BY total_weight DESC;`,
      id ? [id] : []
    );

    res.json(rows);
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
  }
  return;
}

export async function getUserAnalytics(
  req: Request<{ id?: string; time: Time }>,
  res: Response
) {
  const { id, time } = req.params;

  const query_date_filter = getQueryDateFilter(time);

  const whereClause = id
    ? `WHERE timestamp ${query_date_filter} AND user_id = ?`
    : `WHERE timestamp ${query_date_filter}`;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        user_id,
        SUM(points_added) as total_points, 
        COUNT(user_id) as total_exchange_count
        FROM exchange_log
        ${whereClause};`,
      id ? [id] : []
    );

    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    throwServerError(res);
  }
  return;
}

export async function getDashboardAnalytics(
  req: Request<{}, {}, {}, { time?: Time }>,
  res: Response
) {
  const time = req.query.time;
  const dateFilter = getQueryDateFilter(time as Time);

  const getWhereClause = (table_column: string) => {
    return dateFilter ? `WHERE ${table_column} ${dateFilter}` : "";
  };

  try {
    const [totalUsers] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(user_id) as total_users FROM user ${getWhereClause(
        "createdAt"
      )};`
    );

    const [totalMaterials] = await pool.query<RowDataPacket[]>(
      `SELECT ROUND(SUM(weight), 1) as total_weight FROM exchange_log ${getWhereClause(
        "timestamp"
      )};`
    );

    const [topMaterial] = await pool.query<RowDataPacket[]>(
      `SELECT
        m.material,
        ROUND(SUM(el.weight), 1) as weight
        FROM exchange_log as el
        INNER JOIN material as m ON el.material_id = m.material_id
        ${getWhereClause("timestamp")}
        GROUP BY m.material_id
        ORDER BY weight DESC
        LIMIT 1;`
    );

    const [totalExchanges] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(exchange_log_id) as total_exchanges FROM exchange_log ${getWhereClause(
        "timestamp"
      )};`
    );

    const [totalPoints] = await pool.query<RowDataPacket[]>(
      `SELECT ROUND(SUM(points_added), 1) as total_points FROM exchange_log ${getWhereClause(
        "timestamp"
      )};`
    );

    const [totalAnnouncements] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(announcement_id) as total_announcements FROM announcement ${getWhereClause(
        "createdAt"
      )};`
    );

    res.json({
      total_users: totalUsers[0].total_users,
      total_weight: totalMaterials[0].total_weight,
      top_material: topMaterial[0],
      total_exchanges: totalExchanges[0].total_exchanges,
      total_points: totalPoints[0].total_points,
      total_announcements: totalAnnouncements[0].total_announcements,
    });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
  }
}
