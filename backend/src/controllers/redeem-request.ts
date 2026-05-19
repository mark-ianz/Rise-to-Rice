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
import { nanoid } from "nanoid";

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

    const nano_id = nanoid();

    const [insert] = await connection.query<ResultSetHeader>(
      `INSERT INTO redeem_request (user_id, variation_id, nano_id) VALUES (?, ?, ?)`,
      [user_id, variation_id, nano_id]
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

    // Fetch resident user information
    const [userRows]: any = await connection.query(
      `SELECT u.preferred_language, u.first_name, a.email 
       FROM user u 
       INNER JOIN account a ON u.user_id = a.user_id 
       WHERE u.user_id = ?`,
      [user_id]
    );
    const targetUser = userRows?.[0];
    const targetEmail = targetUser?.email;
    const targetFirstName = targetUser?.first_name;
    const lang = targetUser?.preferred_language === "tl" ? "tl" : "en";

    // Fetch reward variation details
    const [variationRows]: any = await connection.query(
      `SELECT rv.quantity, rv.points_cost, r.reward_name, r.unit 
       FROM reward_variation rv 
       INNER JOIN reward r ON rv.reward_id = r.reward_id 
       WHERE rv.variation_id = ?`,
      [variation_id]
    );
    const variation = variationRows?.[0];
    const rewardName = variation?.reward_name || "Reward";
    const quantityText = variation ? `${variation.quantity} ${variation.unit.toUpperCase()}` : "1";
    const pointsCostVal = variation?.points_cost || pointsCost;

    const subject = lang === "tl"
      ? "Resibo ng Iyong Redeem Request"
      : "Receipt for Your Redemption Request";

    const text = lang === "tl"
      ? `Natanggap na namin ang iyong redeem request! Reward: ${rewardName}, Dami: ${quantityText}, Puntos na Ginamit: ${pointsCostVal} pts.`
      : `We have received your redemption request! Reward: ${rewardName}, Quantity: ${quantityText}, Points Redeemed: ${pointsCostVal} pts.`;

    const actionUrl = `${process.env.FRONTEND_URL}/activity-history/redeem/${nano_id}`;

    if (targetEmail) {
      await sendEmail(targetEmail, subject, text, undefined, {
        lang,
        actionUrl,
        firstName: targetFirstName,
        receiptInfo: {
          rewardName,
          quantity: quantityText,
          pointsCost: pointsCostVal,
        },
      });
    }

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

    const { new_status, email, points_cost, user_id, current_status, admin_notes } =
      UpdateRedeemRequestStatusSchema.parse(req.body);

    if (new_status === current_status) {
      res.status(400).json({ error: "The new status cannot be the same as the current status." });
      return;
    }

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

    const [userRows]: any = await connection.query(
      "SELECT preferred_language, first_name FROM user WHERE user_id = ?",
      [user_id]
    );
    const userPrefLang = userRows?.[0]?.preferred_language;
    const firstName = userRows?.[0]?.first_name;
    const lang = userPrefLang === "tl" ? "tl" : "en";

    let text = "";
    const templates = [
      {
        status: "for pick up",
        message:
          "Your redeem request is ready for pick up. You can now visit the barangay hall to claim your reward.",
        messageTl:
          "Ang iyong redeem request ay maaari nang kunin. Maaari ka nang pumunta sa barangay hall para makuha ang iyong reward.",
      },
      {
        status: "completed",
        message:
          "Your redeem request has been completed. Thank you for your patience.",
        messageTl:
          "Ang iyong redeem request ay matagumpay nang nakumpleto. Maraming salamat sa iyong paglahok sa pagpapanatiling malinis ng ating komunidad!",
      },
      {
        status: "rejected",
        message:
          "Your redeem request has been rejected. The points you used for this request have been returned to your account. Please contact us for more information.",
        messageTl:
          "Ang iyong redeem request ay tinanggihan. Ang mga puntos na iyong ginamit para sa hiling na ito ay naibalik na sa iyong account. Mangyaring makipag-ugnayan sa amin para sa karagdagang impormasyon.",
      },
      {
        status: "cancelled",
        message:
          "Your redeem request has been cancelled. The points you used for this request have been returned to your account. Please contact us for more information.",
        messageTl:
          "Ang iyong redeem request ay nakansela. Ang mga puntos na iyong ginamit para sa hiling na ito ay naibalik na sa iyong account. Mangyaring makipag-ugnayan sa amin para sa karagdagang impormasyon.",
      },
      {
        status: "pending",
        message:
          "Your redeem request is pending. Please wait for further updates.",
        messageTl:
          "Ang iyong redeem request ay kasalukuyang pinoproseso. Mangyaring maghintay para sa mga susunod na balita.",
      },
      {
        status: "working",
        message: "Your redeem request is now being worked on.",
        messageTl: "Ang iyong redeem request ay kasalukuyang tinatrabaho na ng aming mga tauhan.",
      },
    ];

    const statusObj = templates.find((t) => t.status === new_status);
    if (statusObj) {
      text = lang === "tl" ? statusObj.messageTl : statusObj.message;
    }

    await pool.query(
      `UPDATE redeem_request SET status = ?, admin_notes = ? WHERE redeem_request_id = ?`,
      [new_status, admin_notes || null, id]
    );

    const [rrData]: any = await connection.query(
      "SELECT nano_id FROM redeem_request WHERE redeem_request_id = ?",
      [id]
    );
    const nano_id = rrData?.[0]?.nano_id;
    const actionUrl = nano_id ? `${process.env.FRONTEND_URL}/activity-history/redeem/${nano_id}` : undefined;

    await sendEmail(
      email,
      lang === "tl" ? "Balita sa Iyong Redeem Request" : "Redeem Request Status Update",
      text,
      undefined,
      {
        lang,
        actionUrl,
        firstName,
        adminNotes: admin_notes || undefined,
        statusInfo: {
          status: new_status,
          message: text,
        },
      }
    );

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
    const { page, limit, status, search, startDate, endDate } = req.query as any;

    let whereClause = { statement: "WHERE user_id = ?", values: [id] };

    if (search) {
      whereClause.statement += " AND r.reward_name LIKE ?";
      whereClause.values.push(`%${search}%`);
    }

    if (status && status.length > 0) {
      const statusArr = Array.isArray(status) ? status : [status];
      const placeholder = statusArr.map(() => "?").join(", ");
      whereClause.statement += ` AND status IN (${placeholder})`;
      whereClause.values.push(...statusArr);
    }

    if (startDate) {
      whereClause.statement += " AND rr.timestamp >= ?";
      whereClause.values.push(startDate);
    }

    if (endDate) {
      whereClause.statement += " AND rr.timestamp <= ?";
      whereClause.values.push(endDate);
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

    const [rrData]: any = await connection.query(
      "SELECT user_id, nano_id FROM redeem_request WHERE redeem_request_id = ?",
      [id]
    );
    const targetUserId = rrData?.[0]?.user_id || req.user!.user_id;
    const nano_id = rrData?.[0]?.nano_id;
    const actionUrl = nano_id ? `${process.env.FRONTEND_URL}/activity-history/redeem/${nano_id}` : undefined;

    const [userRows]: any = await connection.query(
      `SELECT u.preferred_language, u.first_name, a.email 
       FROM user u 
       INNER JOIN account a ON u.user_id = a.user_id 
       WHERE u.user_id = ?`,
      [targetUserId]
    );
    const userPrefLang = userRows?.[0]?.preferred_language;
    const firstName = userRows?.[0]?.first_name;
    const targetEmail = userRows?.[0]?.email || req.user!.email;
    const lang = userPrefLang === "tl" ? "tl" : "en";
    const text = lang === "tl"
      ? "Ang iyong redeem request ay nakansela. Ang mga puntos na iyong ginamit para sa hiling na ito ay naibalik na sa iyong account."
      : "Your redeem request has been cancelled. The points you used for this request have been returned to your account.";

    await sendEmail(
      targetEmail,
      lang === "tl" ? "Balita sa Iyong Redeem Request" : "Redeem Request Status Update",
      text,
      undefined,
      {
        lang,
        actionUrl,
        firstName,
        statusInfo: {
          status: "cancelled",
          message: text,
        },
      }
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

export async function handleCancelStatusUser(
  req: Request<{ id: string }, {}, { cancel_reason: string }>,
  res: Response
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { cancel_reason } = req.body;

    // Verify it is still pending and belongs to user
    const [rr]: any = await connection.query(
      `SELECT rr.status, rv.points_cost, rr.nano_id
       FROM redeem_request rr
       JOIN reward_variation rv ON rr.variation_id = rv.variation_id
       WHERE rr.redeem_request_id = ? AND rr.user_id = ?`,
      [id, req.user!.user_id]
    );

    if (rr.length === 0) {
      res.status(404).json({ error: "Redeem request not found" });
      return;
    }

    if (rr[0].status !== "pending") {
      res.status(400).json({ error: "Only pending requests can be cancelled" });
      return;
    }

    const points_cost = rr[0].points_cost;

    await connection.query(
      `UPDATE redeem_request SET status = 'cancelled', cancel_reason = ? WHERE redeem_request_id = ?`,
      [cancel_reason, id]
    );

    // return the points to the user
    await connection.query(
      `UPDATE points SET points_accumulated = points_accumulated + ? WHERE user_id = ?`,
      [points_cost, req.user!.user_id]
    );

    const [userRows]: any = await connection.query(
      "SELECT preferred_language, first_name FROM user WHERE user_id = ?",
      [req.user!.user_id]
    );
    const userPrefLang = userRows?.[0]?.preferred_language;
    const firstName = userRows?.[0]?.first_name;
    const lang = userPrefLang === "tl" ? "tl" : "en";
    const text = lang === "tl"
      ? "Ang iyong redeem request ay nakansela. Ang mga puntos na iyong ginamit para sa hiling na ito ay naibalik na sa iyong account."
      : "Your redeem request has been cancelled. The points you used for this request have been returned to your account.";

    const actionUrl = rr[0].nano_id ? `${process.env.FRONTEND_URL}/activity-history/redeem/${rr[0].nano_id}` : undefined;

    await sendEmail(
      req.user!.email,
      lang === "tl" ? "Balita sa Iyong Redeem Request" : "Redeem Request Status Update",
      text,
      undefined,
      {
        lang,
        actionUrl,
        firstName,
        statusInfo: {
          status: "cancelled",
          message: text,
        },
      }
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

export async function handleGetRedeemRequestByNanoId(
  req: Request<{ nano_id: string }>,
  res: Response
) {
  try {
    const { nano_id } = req.params;

    const query = `
      SELECT rr.*, rv.*, r.*, u.first_name, u.last_name, u.contact_number, a.email
      FROM redeem_request rr
      INNER JOIN user u ON u.user_id = rr.user_id
      INNER JOIN account a ON a.user_id = u.user_id
      INNER JOIN reward_variation rv ON rv.variation_id = rr.variation_id
      INNER JOIN reward r ON r.reward_id = rv.reward_id
      WHERE rr.nano_id = ?
    `;

    const [rows]: any = await pool.query(query, [nano_id]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Redeem request not found" });
      return;
    }

    res.json(rows[0]);
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}
