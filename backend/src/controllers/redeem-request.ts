import { Request, Response } from "express";
import { ZodError } from "zod";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import {
  CreateRedeemRequestSchema,
  UpdateRedeemRequestStatusSchema,
} from "../schema/RedeemRequest";
import pool from "../connection/database";
import { checkForPagination } from "../helpers/query";
import { PaginationParams } from "../types/params";
import {
  getRedeemRequest,
  getUserRedeemRequest,
} from "../service/redeem-request.service";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Points } from "../types/points";
import { sendEmail } from "../helpers/mailer";

export async function handlePostRedeemRequest(req: Request, res: Response) {
  // initialize the connection
  const connection = await pool.getConnection();

  try {
    const { user_id, variation_id, points_cost } =
      CreateRedeemRequestSchema.parse(req.body);

    // initialize the transaction
    await connection.beginTransaction();

    // get user points first
    const [points] = await connection.query<(Points & RowDataPacket)[]>(
      `SELECT points_accumulated FROM points WHERE user_id = ?`,
      [user_id]
    );

    const userPoints = points[0]?.points_accumulated;
    const pointsCost = points_cost;

    // check if user has enough points
    if (userPoints < pointsCost) {
      res.status(400).json({
        errors: ["You don't have enought points to redeem this reward."],
      });
      return;
    }

    const [insert] = await connection.query<ResultSetHeader>(
      `INSERT INTO redeem_request (user_id, variation_id) VALUES (?, ?)`,
      [user_id, variation_id]
    );

    // deduct points from user
    await connection.query(
      `UPDATE points SET points_accumulated = points_accumulated - ? WHERE user_id = ?`,
      [pointsCost, user_id]
    );

    // get the new request
    const [redeemRequest] = await connection.query<ResultSetHeader[]>(
      `SELECT * FROM redeem_request WHERE redeem_request_id = ?`,
      [insert.insertId]
    );

    // commit the transaction
    await connection.commit();

    res.status(201).json(redeemRequest[0]);
    return;
  } catch (error) {
    await connection.rollback();
    console.log(error);
    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
    return;
  } finally {
    // release the connection
    connection.release();
  }
}

export async function handleGetRedeemRequest(
  req: Request<{ id: string }, {}, {}, PaginationParams>,
  res: Response
) {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;

    const pagination = await checkForPagination(
      page,
      limit,
      "redeem_request",
      "redeem_request_id",
      { statement: "user_id = ?", values: [id] }
    );

    if (!pagination) {
      res.status(400).json({ error: "Invalid pagination query." });
      return;
    }

    const result = await getRedeemRequest(
      pool,
      pagination?.limitInt,
      pagination?.offset,
      {
        statement: "user_id = ?",
        values: [id],
      }
    );

    res.status(200).json({
      result: result,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function handleGetAllRedeemRequests(
  req: Request<{}, {}, {}, PaginationParams & { status?: string[] }>,
  res: Response
) {
  const { page, limit, search, searchFor, status } = req.query;
  try {
    let whereClause: { statement: string; values: string[] } = {
      statement: "",
      values: [],
    };

    if (searchFor) {
      switch (searchFor) {
        case "email":
          whereClause = {
            values: [`%${search}%`],
            statement: `
              WHERE a.email LIKE ?`,
          };
          break;
        case "contact_number":
          whereClause = {
            values: [`%${search}%`],
            statement: "WHERE u.contact_number LIKE ?",
          };
          break;

        case "reward_name":
          whereClause = {
            values: [`%${search}%`],
            statement: "WHERE r.reward_name LIKE ?",
          };
          break;
      }
    }

    if (status && status.length > 0) {
      // this maps to the status and put ? each
      const placeholder = status.map(() => "?").join(", ");

      // if there was an existing whereClause, append with AND else use WHERE
      const statement = whereClause.statement
        ? whereClause.statement + ` AND status IN (${placeholder})`
        : `WHERE status IN (${placeholder})`;

      // manipulate the whereClause
      whereClause = {
        statement,
        // spread the current whereClause values and the status
        values: [...whereClause.values, ...status],
      };
    }

    const pagination = await checkForPagination(
      page,
      limit,
      "redeem_request AS rr",
      "redeem_request_id",
      whereClause,
      `INNER JOIN user AS u ON u.user_id = rr.user_id
       INNER JOIN account AS a ON a.user_id = u.user_id
       INNER JOIN reward_variation AS rv ON rv.variation_id = rr.variation_id
       INNER JOIN reward AS r ON r.reward_id = rv.reward_id`
    );

    console.log(pagination);

    if (!pagination) {
      console.log("Invalid Pagination");
      res.status(400).json({ error: "Invalid pagination query." });
      return;
    }

    const result = await getRedeemRequest(
      pool,
      pagination?.limitInt,
      pagination?.offset,
      whereClause
    );

    res.status(200).json({
      result: result,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function handleDeleteRedeemRequest(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM redeem_request WHERE redeem_request_id = ?`, [
      id,
    ]);

    res.json({ message: "Redeem request deleted successfully." });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function handleStatusUpdate(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const { new_status, email, points_cost, user_id, current_status } =
      UpdateRedeemRequestStatusSchema.parse(req.body);

    // if status is cancel or rejected, add points back to user
    // if the previous status is cancelled or rejected, do not add points back
    let shouldAddPointsBack = true;

    if (new_status === "cancelled" || new_status === "rejected") {
      if (
        (current_status === "cancelled" && new_status === "rejected") ||
        (current_status === "rejected" && new_status === "cancelled")
      ) {
        shouldAddPointsBack = false;
      }
    }

    if (shouldAddPointsBack) {
      await connection.query(
        `UPDATE points SET points_accumulated = points_accumulated + ? WHERE user_id = ?`,
        [points_cost, user_id]
      );
    }

    console.log({ new_status, email, points_cost, user_id, current_status });

    let text = "";
    const templates = [
      {
        status: "for pick up",
        message:
          "Your redeem request is ready for pick up. You can now visit the barangay hall to claim your reward.",
      },
      {
        status: "completed",
        message:
          "Your redeem request has been completed. Thank you for your patience.",
      },
      {
        status: "rejected",
        message:
          "Your redeem request has been rejected. The points you used for this request have been returned to your account. You Please contact us for more information.",
      },
      {
        status: "cancelled",
        message:
          "Your redeem request has been cancelled. The points you used for this request have been returned to your account. Please contact us for more information.",
      },
      {
        status: "cending",
        message:
          "Your redeem request is pending. Please wait for further updates.",
      },
    ];

    const statusObj = templates.find((t) => t.status === new_status);
    if (statusObj) {
      text = statusObj.message;
    }

    await pool.query(
      `UPDATE redeem_request SET status = ? WHERE redeem_request_id = ?`,
      [new_status, id]
    );

    await sendEmail(email, "Redeem Request Status Update", text);

    await connection.commit();

    res.json({ message: "Redeem request status updated successfully." });
    return;
  } catch (error) {
    await connection.rollback();

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    console.log(error);
    throwServerError(res);
    return;
  } finally {
    connection.release();
  }
}

export async function handleGetAllRedeemRequestsByUser(
  req: Request<
    { id: string },
    {},
    {},
    PaginationParams & { status?: string[] }
  >,
  res: Response
) {
  try {
    const { id } = req.params;
    const { page, limit, status } = req.query;

    let whereClause = { statement: "WHERE user_id = ?", values: [id] };

    if (status && status.length > 0) {
      // this maps to the status and put ? each
      const placeholder = status.map(() => "?").join(", ");

      // if there was an existing whereClause, append with AND else use WHERE
      const statement = ` AND status IN (${placeholder})`;

      // manipulate the whereClause
      whereClause = {
        statement: whereClause.statement + statement,
        // spread the current whereClause values and the status
        values: [...whereClause.values, ...status],
      };
    }

    const pagination = await checkForPagination(
      page,
      limit,
      "redeem_request",
      "redeem_request_id",
      whereClause
    );

    if (!pagination) {
      res.status(400).json({ error: "Invalid pagination query." });
      return;
    }

    const result = await getUserRedeemRequest(
      pool,
      pagination?.limitInt,
      pagination?.offset,
      whereClause
    );

    res.status(200).json({
      result: result,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function handleCancelStatus(
  req: Request<{ id: string }, {}, { points_cost: number }>,
  res: Response
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { points_cost } = req.body;

    await pool.query(
      `UPDATE redeem_request SET status = 'cancelled' WHERE redeem_request_id = ?`,
      [id]
    );

    console.log(points_cost, req.user!.user_id);

    // return the points to the user
    await connection.query(
      `UPDATE points SET points_accumulated = points_accumulated + ? WHERE user_id = ?`,
      [points_cost, req.user!.user_id]
    );

    await sendEmail(
      req.user!.email,
      "Redeem Request Status Update",
      "Your redeem request has been cancelled. The points you used for this request have been returned to your account."
    );

    await connection.commit();

    res.json({ message: "Redeem request cancelled successfully." });
    return;
  } catch (error) {
    await connection.rollback();
    console.log(error);
    throwServerError(res);
    return;
  } finally {
    connection.release();
  }
}
