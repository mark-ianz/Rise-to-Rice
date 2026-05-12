import { PoolConnection } from "mysql2/promise";

export async function manipulateUserPoints_service(
  connection: PoolConnection,
  action: "add_points" | "deduct_points",
  points_to_manipulate: number,
  user_id: number
) {
  const operator = action === "add_points" ? "+" : "-";
  // update user points
  await connection.query(
    `UPDATE points SET points_accumulated = points_accumulated ${operator} ? WHERE user_id = ?`,
    [points_to_manipulate, user_id]
  );
  return;
}
