import { Request, Response } from "express";
import { LogExchange, LogExchangeSchema } from "../schema/LogExchange";
import pool from "../connection/database";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { saveToActionLog } from "../service/admin.service";
import { ZodError } from "zod";
import { manipulateUserPoints_service } from "../service/points.service";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import { sendEmail } from "../helpers/mailer";

export async function logExchange(
  req: Request<{}, {}, LogExchange>,
  res: Response
) {
  const connection = await pool.getConnection();

  const logged_by = req.user!.user_id;
  let image_url: string | null = null;

  try {
    const { user_id, material_id, weight, points_added } =
      LogExchangeSchema.parse(req.body);

    if (req.file) {
      console.log("Uploading file to Cloudinary:", req.file.path);
      image_url = await uploadToCloudinary(req.file.path);
      console.log("File uploaded successfully. Cloudinary URL:", image_url);

      try {
        await fs.unlink(req.file.path);
        console.log("Deleted temporary local file:", req.file.path);
      } catch (err) {
        console.error("Failed to delete temporary local file:", req.file.path, err);
      }
    }

    await connection.beginTransaction();

    const nano_id = nanoid();

    // insert exchange log
    await connection.query(
      "INSERT INTO exchange_log (user_id, logged_by, material_id, weight, points_added, image_url, nano_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, logged_by, material_id, weight, points_added, image_url, nano_id]
    );

    // update user points
    await manipulateUserPoints_service(
      connection,
      "add_points",
      points_added,
      user_id
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

    // Fetch material name
    const [materialRows]: any = await connection.query(
      `SELECT material FROM material WHERE material_id = ?`,
      [material_id]
    );
    const materialName = materialRows?.[0]?.material || "Recyclable waste";

    // Fetch admin name
    const [adminRows]: any = await connection.query(
      `SELECT first_name, last_name FROM user WHERE user_id = ?`,
      [logged_by]
    );
    const adminFirstName = adminRows?.[0]?.first_name || "";
    const adminLastName = adminRows?.[0]?.last_name || "";
    const loggedByName = adminFirstName ? `${adminFirstName} ${adminLastName}`.trim() : "Staff";

    const subject = lang === "tl"
      ? "Matagumpay na Pagpapalit ng Waste Material"
      : "Waste Material Exchanged Successfully";

    const text = lang === "tl"
      ? `Isang bagong waste material exchange ang naitala sa iyong account. Materyal: ${materialName}, Timbang: ${weight} kg, Puntos: +${points_added} pts.`
      : `A new waste material exchange has been logged to your account. Material: ${materialName}, Weight: ${weight} kg, Points: +${points_added} pts.`;

    const actionUrl = `${process.env.FRONTEND_URL}/activity-history/exchange/${nano_id}`;

    if (targetEmail) {
      await sendEmail(targetEmail, subject, text, undefined, {
        lang,
        actionUrl,
        firstName: targetFirstName,
        exchangeInfo: {
          materialName,
          weight,
          pointsAdded: points_added,
          loggedBy: loggedByName,
        },
      });
    }

    // save to action log
    saveToActionLog(connection, "exchange_log", logged_by, {
      user_id,
      material_id,
      weight,
      points_added,
      image_url,
    });

    await connection.commit();
    res.json({ message: "Exchange logged successfully." });
  } catch (error) {
    console.log(error);

    if (image_url) {
      try {
        await deleteFromCloudinary(image_url);
      } catch (cloudinaryErr) {
        console.error("Failed to delete orphaned Cloudinary image:", cloudinaryErr);
      }
    }

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

export async function handleGetExchangeLogByNanoId(
  req: Request<{ nano_id: string }>,
  res: Response
) {
  try {
    const { nano_id } = req.params;

    const query = `
      SELECT el.*, m.*, u.first_name, u.last_name, u.contact_number, a.email,
             lb.first_name AS logged_by_first_name, lb.last_name AS logged_by_last_name
      FROM exchange_log el
      INNER JOIN user u ON u.user_id = el.user_id
      INNER JOIN account a ON a.user_id = u.user_id
      INNER JOIN material m ON m.material_id = el.material_id
      LEFT JOIN user lb ON lb.user_id = el.logged_by
      WHERE el.nano_id = ?
    `;

    const [rows]: any = await pool.query(query, [nano_id]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Exchange log not found" });
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
