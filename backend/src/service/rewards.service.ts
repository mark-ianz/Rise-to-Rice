import { Connection, Pool, RowDataPacket } from "mysql2/promise";
import { RewardAndVariation } from "../types/reward";

export async function getRewards(
  pool: Pool,
  limit: number,
  offset: number,
  whereClause?: {
    statement: string;
    values: (string | number)[];
  },
  isAdmin?: boolean
) {
  const [rewards] = await pool.query<(RewardAndVariation & RowDataPacket)[]>(
    `SELECT 
      r.reward_id,
      r.reward_name,
      r.unit,
      COALESCE(CONCAT('[', GROUP_CONCAT(
        JSON_OBJECT(
          'variation_id', rv.variation_id,
          'quantity', rv.quantity,
          'points_cost', rv.points_cost
        )
      ), ']'), '[]') AS variations
      FROM reward r
      ${isAdmin ? "LEFT" : "INNER"} JOIN reward_variation rv ON r.reward_id = rv.reward_id
      ${whereClause?.statement || ""}
      GROUP BY r.reward_id
      LIMIT ? OFFSET ?;`,
    whereClause ? [...whereClause.values, limit, offset] : [limit, offset]
  );

  // has to get the rewards with reward variation as array

  return rewards;
}

export async function getSingleReward (
  pool: Pool | Connection,
  id: string | number
): Promise<RewardAndVariation | null> {
  const [rewards] = await pool.query<(RewardAndVariation & RowDataPacket)[]>(
    `SELECT 
      r.reward_id,
      r.reward_name,
      r.unit,
      COALESCE(CONCAT('[', GROUP_CONCAT(
        JSON_OBJECT(
          'variation_id', rv.variation_id,
          'quantity', rv.quantity,
          'points_cost', rv.points_cost
        )
      ), ']'), '[]') AS variations
      FROM reward r
      LEFT JOIN reward_variation rv ON r.reward_id = rv.reward_id
      WHERE r.reward_id = ?
      GROUP BY r.reward_id;`,
    [id]
  );

  if (rewards.length === 0) return null;

  return rewards[0];
}