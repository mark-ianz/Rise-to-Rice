import { PoolConnection } from "mysql2/promise";

export async function saveToActionLog(
  connection: PoolConnection,
  action: string,
  performed_by: number,
  details: any
) {
  details = JSON.stringify(details);
  const [result] = await connection.query(
    "INSERT INTO action_log (action, performed_by, details) VALUES (?, ?, ?)",
    [action, performed_by, details]
  );
}
