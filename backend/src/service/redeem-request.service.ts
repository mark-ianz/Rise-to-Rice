import { Pool } from "mysql2/promise";

export async function getRedeemRequest(
  pool: Pool,
  limit: number,
  offset: number,
  whereClause?: {
    statement: string;
    values: (string | number)[];
  }
) {
  const [redeemRequests] = await pool.query(
    `SELECT rr.*, rv.quantity, rv.points_cost, r.*, a.email, u.contact_number
         FROM redeem_request AS rr
         INNER JOIN reward_variation as rv
         ON rr.variation_id = rv.variation_id
         INNER JOIN reward as r
         ON r.reward_id = rv.reward_id
         INNER JOIN account as a
         ON a.user_id = rr.user_id
         INNER JOIN user as u
         ON u.user_id = rr.user_id
         ${whereClause?.statement || ""}
         ORDER BY rr.timestamp DESC
         LIMIT ? OFFSET ?`,
    whereClause ? [...whereClause.values, limit, offset] : [limit, offset]
  );

  return redeemRequests;
}

export async function getUserRedeemRequest (
  pool: Pool,
  limit: number,
  offset: number,
  whereClause?: {
    statement: string;
    values: (string | number)[];
  }
) {
  const [redeemRequests] = await pool.query(
    `SELECT rr.*, rv.quantity, rv.points_cost, r.*
         FROM redeem_request AS rr
         INNER JOIN reward_variation as rv
         ON rr.variation_id = rv.variation_id
         INNER JOIN reward as r
         ON r.reward_id = rv.reward_id
         ${whereClause?.statement || ""}
         ORDER BY rr.timestamp DESC
         LIMIT ? OFFSET ?`,
    whereClause ? [...whereClause.values, limit, offset] : [limit, offset]
  );

  return redeemRequests;
}