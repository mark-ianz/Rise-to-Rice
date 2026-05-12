import { Request, Response } from "express";
import {
  AnnouncementCreate,
  AnnouncementCreateSchema,
  UpdateAnnouncementSchema,
} from "../schema/AnnouncementCreate";
import pool from "../connection/database";
import { Announcement, GetAnnouncement } from "../types/announcement";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { handleZodErrors, throwServerError } from "../helpers/errorHandlers";
import { saveToActionLog } from "../service/admin.service";
import { querySingleAnnouncement } from "../service/announcement.service";
import { ZodError } from "zod";
import { User } from "../types/account_info.types";
import path from "path";
import { promises as fs } from "fs";
import { checkForPagination } from "../helpers/query";

export async function postAnnouncement(
  req: Request<{}, {}, AnnouncementCreate>,
  res: Response
) {
  const authorId = req.user!.user_id;
  const connection = await pool.getConnection();

  try {
    // validate the request body
    const { title, description } = AnnouncementCreateSchema.parse({
      ...req.body,
    });

    // start transaction
    await connection.beginTransaction();

    // image_url will be null if no image is uploaded
    let image_url: string | null = null;

    // first step is to upload the image to imgur if it exists
    if (req.file) {
      console.log(req.file);
      image_url = `/uploads/${req.file.filename}`;

      // release the connection
      await connection.rollback();
      connection.release();
    }

    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO announcement (title, description, image_url, author_id) VALUES (?, ?, ?, ?)",
      [title, description, image_url, authorId]
    );

    saveToActionLog(connection, "post_announcement", authorId, {
      announcement_id: result.insertId,
      title,
      description,
      image_url,
    });

    const announcementId = result.insertId;

    const new_announcement = await querySingleAnnouncement(
      connection,
      announcementId
    );

    await connection.commit();

    res.status(201).json(new_announcement);
  } catch (error) {
    await connection.rollback();

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    console.log(error);
    throwServerError(res);
  } finally {
    if (connection) connection.release();
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
    const result = await querySingleAnnouncement(pool, Number(id));

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

  try {
    const { title, description } = UpdateAnnouncementSchema.parse(req.body);
    await connection.beginTransaction();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE announcement SET title = ?, description = ? WHERE announcement_id = ?",
      [title, description, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    // save to action log
    saveToActionLog(connection, "update_announcement", action_performer, {
      announcement_id: id,
      title,
      description,
    });

    await connection.commit();

    res.json({ message: "Announcement updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.log(error);

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
  return;
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
      const filePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(imageUrl)
      );
      try {
        await fs.unlink(filePath);
        console.log("Deleted file:", filePath);
      } catch (err) {
        console.error("File deletion error:", err);
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
