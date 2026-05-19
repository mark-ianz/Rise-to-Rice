import { Request, Response } from "express";
import {
  AnnouncementCreate,
  AnnouncementCreateSchema,
  UpdateAnnouncementSchema,
} from "../schema/AnnouncementCreate";
import pool from "../connection/database";
import { Announcement, GetAnnouncement } from "../types/announcement";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { saveToActionLog } from "../service/admin.service";
import { querySingleAnnouncement } from "../service/announcement.service";
import { ZodError } from "zod";
import { User } from "../types/account_info.types";
import path from "path";
import { promises as fs } from "fs";
import { checkForPagination } from "../helpers/query";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { generatePublicId } from "../utils/generate";

export async function postAnnouncement(
  req: Request<{}, {}, AnnouncementCreate>,
  res: Response
) {
  const authorId = req.user!.user_id;
  let connection: PoolConnection | null = null;
  let image_url: string | null = null;

  try {
    // validate the request body
    const { title, description } = AnnouncementCreateSchema.parse({
      ...req.body,
    });

    // If an image is uploaded, upload it to Cloudinary first
    if (req.file) {
      console.log("Uploading file to Cloudinary:", req.file.path);
      image_url = await uploadToCloudinary(req.file.path);
      console.log("File uploaded successfully. Cloudinary URL:", image_url);

      // Clean up the local temp file immediately
      try {
        await fs.unlink(req.file.path);
        console.log("Deleted temporary local file:", req.file.path);
      } catch (err) {
        console.error("Failed to delete temporary local file:", req.file.path, err);
      }
    }

    connection = await pool.getConnection();

    // start transaction
    await connection.beginTransaction();

    const announcementId = generatePublicId();

    await connection.query<ResultSetHeader>(
      "INSERT INTO announcement (announcement_id, title, description, image_url, author_id) VALUES (?, ?, ?, ?, ?)",
      [announcementId, title, description, image_url, authorId]
    );

    saveToActionLog(connection, "post_announcement", authorId, {
      announcement_id: announcementId,
      title,
      description,
      image_url,
    });

    const new_announcement = await querySingleAnnouncement(
      connection,
      announcementId
    );

    await connection.commit();

    res.status(201).json(new_announcement);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    // Clean up uploaded Cloudinary image if database operation failed
    if (image_url) {
      try {
        console.log("Database transaction failed. Cleaning up Cloudinary image...");
        await deleteFromCloudinary(image_url);
      } catch (cloudinaryErr) {
        console.error("Failed to delete orphaned Cloudinary image:", cloudinaryErr);
      }
    }

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    console.log(error);
    throwServerError(res);
  } finally {
    if (connection) {
      connection.release();
    }
  }
  return;
}

export async function getAnnouncements(
  req: Request<{}, {}, {}, GetAnnouncement>,
  res: Response
) {
  const { page, limit, author_id, sort } = req.query;

  const pagination = await checkForPagination(page, limit, "announcement", "announcement_id");

  if (!pagination) {
    res.status(400).json({ error: "Invalid pagination query." });
    return;
  }

  try {
    let values = [];
    let query = `SELECT a.*, COUNT(r.announcement_id) AS total_reactions 
    FROM announcement AS a
    LEFT JOIN reactions AS r
    ON a.announcement_id = r.announcement_id`;

    if (author_id) {
      values.push(author_id);
      query += " WHERE a.author_id = ?";
    }

    query += ` GROUP BY a.announcement_id`;

    // Add sorting logic
    if (sort === "oldest") {
      query += ` ORDER BY a.createdAt ASC`;
    } else if (sort === "reactions") {
      query += ` ORDER BY total_reactions DESC`;
    } else {
      query += ` ORDER BY a.createdAt DESC`; // Default to newest
    }

    query += ` LIMIT ? OFFSET ?`;

    values.push(pagination.limitInt, pagination.offset);

    const [result] = await pool.query<(Announcement & RowDataPacket)[]>(query, values);

    res.json({
      result,
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

export async function getSingleAnnouncement(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await querySingleAnnouncement(pool, id);

    if (!result) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.log(error);
    throwServerError(res);
  }
  return;
}

export async function updateAnnouncement(
  req: Request<{ id: string }, {}, AnnouncementCreate>,
  res: Response
) {
  const { id } = req.params;
  const connection = await pool.getConnection();
  const action_performer = req.user!.user_id;
  let new_image_url: string | null = null;
  let old_image_url: string | null = null;

  try {
    const { title, description } = UpdateAnnouncementSchema.parse({
      ...req.body,
    });

    // Get the existing announcement to retrieve the current image_url
    const [announcement] = await connection.query<
      (Announcement & RowDataPacket)[]
    >("SELECT * FROM announcement WHERE announcement_id = ?", [id]);

    if (announcement.length === 0) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    old_image_url = announcement[0].image_url ?? null;

    // If a new file is uploaded, upload to Cloudinary
    if (req.file) {
      console.log("Uploading replacement file to Cloudinary:", req.file.path);
      new_image_url = await uploadToCloudinary(req.file.path);
      console.log("Replacement file uploaded. Cloudinary URL:", new_image_url);

      // Clean up the temporary local file
      try {
        await fs.unlink(req.file.path);
        console.log("Deleted temporary local file:", req.file.path);
      } catch (err) {
        console.error("Failed to delete temporary local file:", req.file.path, err);
      }
    }

    await connection.beginTransaction();

    const query = new_image_url 
      ? "UPDATE announcement SET title = ?, description = ?, image_url = ? WHERE announcement_id = ?"
      : "UPDATE announcement SET title = ?, description = ? WHERE announcement_id = ?";

    const queryParams = new_image_url 
      ? [title, description, new_image_url, id]
      : [title, description, id];

    const [result] = await connection.query<ResultSetHeader>(query, queryParams);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    // save to action log
    saveToActionLog(connection, "update_announcement", action_performer, {
      announcement_id: id,
      title,
      description,
      image_url: new_image_url || old_image_url,
    });

    await connection.commit();

    // If a new image was successfully uploaded, delete the old image to prevent orphans
    if (new_image_url && old_image_url) {
      if (old_image_url.includes("cloudinary.com")) {
        try {
          await deleteFromCloudinary(old_image_url);
          console.log("Successfully deleted old image from Cloudinary:", old_image_url);
        } catch (err) {
          console.error("Failed to delete old image from Cloudinary:", old_image_url, err);
        }
      } else {
        // Clean up legacy local file
        const filePath = path.join(
          __dirname,
          "../../uploads",
          path.basename(old_image_url)
        );
        try {
          await fs.unlink(filePath);
          console.log("Successfully deleted old legacy file:", filePath);
        } catch (err) {
          console.error("Failed to delete old legacy file:", filePath, err);
        }
      }
    }

    res.json({ message: "Announcement updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.log(error);

    // Clean up the new image from Cloudinary if the transaction failed
    if (new_image_url) {
      try {
        console.log("Transaction failed. Cleaning up newly uploaded image...");
        await deleteFromCloudinary(new_image_url);
      } catch (cloudinaryErr) {
        console.error("Failed to delete orphaned Cloudinary image:", new_image_url, cloudinaryErr);
      }
    }

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
}

export async function deleteAnnouncement(req: Request, res: Response) {
  const { id } = req.params;
  const connection = await pool.getConnection();

  const action_performer = req.user?.user_id;
  if (!action_performer) {
    res.status(401).json({ error: "Unauthorized request" });
    return;
  }
  try {
    await connection.beginTransaction();

    const [announcement] = await connection.query<
      (Announcement & RowDataPacket)[]
    >("SELECT * FROM announcement WHERE announcement_id = ?", [id]);

    if (announcement.length === 0) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    const imageUrl = announcement[0].image_url;

    if (imageUrl) {
      // Check if it's a Cloudinary URL or a legacy local file URL
      if (imageUrl.includes("cloudinary.com")) {
        try {
          await deleteFromCloudinary(imageUrl);
          console.log("Deleted file from Cloudinary:", imageUrl);
        } catch (err) {
          console.error("Cloudinary file deletion error:", err);
        }
      } else {
        // Legacy local file cleanup
        const filePath = path.join(
          __dirname,
          "../../uploads",
          path.basename(imageUrl)
        );
        try {
          await fs.unlink(filePath);
          console.log("Deleted legacy local file:", filePath);
        } catch (err) {
          console.error("Legacy file deletion error:", err);
        }
      }
    }

    await connection.query<ResultSetHeader>(
      "DELETE FROM announcement WHERE announcement_id = ?",
      [id]
    );

    // save to action log
    saveToActionLog(
      connection,
      "delete_announcement",
      action_performer,
      announcement[0]
    );

    await connection.commit();
    res.json({ message: "Announcement successfully deleted" });
  } catch (error) {
    await connection.rollback();
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
}

export async function getAnnouncementAuthor(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const [authotIdResult] = await pool.query<RowDataPacket[]>(
      "SELECT author_id FROM announcement WHERE announcement_id = ?",
      [req.params.id]
    );

    if (authotIdResult.length === 0) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    const [authorInfo] = await pool.query<User & QueryResult>(
      "SELECT * FROM user WHERE user_id = ?",
      [authotIdResult[0].author_id]
    );

    res.json(authorInfo);
  } catch (error) {
    console.log(error);
    throwServerError(res);
  }

  return;
}
