import { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { Announcement } from "../types/announcement";

export async function querySingleAnnouncement(
  connection: PoolConnection | Pool,
  id: string
) {
  const [result] = await connection.query<(Announcement & RowDataPacket)[]>(
    "SELECT * FROM announcement WHERE announcement_id = ?",
    [id]
  );
  return result[0];
}

export async function insertToAnnouncementEditHistory(
  connection: PoolConnection,
  id: string,
  previousAnnouncement: Announcement,
  action_performer: number
) {
  await connection.query(
    "INSERT INTO announcement_edit_history (announcement_id, title, description, updated_by) VALUES (?, ?, ?, ?)",
    [
      id,
      previousAnnouncement.title,
      previousAnnouncement.description,
      action_performer,
    ]
  );
}
