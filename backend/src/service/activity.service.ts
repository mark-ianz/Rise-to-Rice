import { Pool, RowDataPacket } from "mysql2/promise";

export interface ActivityLog extends RowDataPacket {
  activity_type: 'exchange' | 'redeem';
  id: number;
  points: number;
  timestamp: string;
  material_name: string | null;
  weight: number | null;
  status: string | null;
  reward_name: string | null;
}

export async function getUserActivity(
  pool: Pool,
  userId: number,
  limit: number,
  offset: number,
  filters: {
    type?: string;
    search?: string;
    status?: string[];
    startDate?: string;
    endDate?: string;
  }
) {
  const { type, search, status, startDate, endDate } = filters;

  let exchangeWhere = "WHERE el.user_id = ?";
  let exchangeParams: any[] = [userId];

  if (search) {
    exchangeWhere += " AND m.material LIKE ?";
    exchangeParams.push(`%${search}%`);
  }
  if (startDate) {
    exchangeWhere += " AND el.timestamp >= ?";
    exchangeParams.push(startDate);
  }
  if (endDate) {
    exchangeWhere += " AND el.timestamp <= ?";
    exchangeParams.push(endDate);
  }

  let redeemWhere = "WHERE rr.user_id = ?";
  let redeemParams: any[] = [userId];

  if (search) {
    redeemWhere += " AND r.reward_name LIKE ?";
    redeemParams.push(`%${search}%`);
  }
  if (status && status.length > 0) {
    const placeholders = status.map(() => "?").join(",");
    redeemWhere += ` AND rr.status IN (${placeholders})`;
    redeemParams.push(...status);
  }
  if (startDate) {
    redeemWhere += " AND rr.timestamp >= ?";
    redeemParams.push(startDate);
  }
  if (endDate) {
    redeemWhere += " AND rr.timestamp <= ?";
    redeemParams.push(endDate);
  }

  const exchangeQuery = `
    SELECT 
      'exchange' AS activity_type,
      el.exchange_log_id AS id,
      el.points_added AS points,
      el.timestamp,
      m.material AS material_name,
      el.weight,
      NULL AS status,
      NULL AS reward_name
    FROM exchange_log el
    JOIN material m ON el.material_id = m.material_id
    ${exchangeWhere}
  `;

  const redeemQuery = `
    SELECT 
      'redeem' AS activity_type,
      rr.redeem_request_id AS id,
      rv.points_cost AS points,
      rr.timestamp,
      NULL AS material_name,
      NULL AS weight,
      rr.status,
      r.reward_name
    FROM redeem_request rr
    INNER JOIN reward_variation rv ON rr.variation_id = rv.variation_id
    INNER JOIN reward r ON r.reward_id = rv.reward_id
    ${redeemWhere}
  `;

  let query = "";
  let params: any[] = [];

  if (type === 'exchange') {
    query = `${exchangeQuery} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    params = [...exchangeParams, limit, offset];
  } else if (type === 'redeem') {
    query = `${redeemQuery} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    params = [...redeemParams, limit, offset];
  } else {
    // If searching or filtering by status, we might need to handle the case where one side returns nothing
    query = `
      (${exchangeQuery})
      UNION ALL
      (${redeemQuery})
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;
    params = [...exchangeParams, ...redeemParams, limit, offset];
  }

  const [activities] = await pool.query<ActivityLog[]>(query, params);
  return activities;
}

export async function getUserActivityCount(
  pool: Pool,
  userId: number,
  filters: {
    type?: string;
    search?: string;
    status?: string[];
    startDate?: string;
    endDate?: string;
  }
) {
  const { type, search, status, startDate, endDate } = filters;

  let exchangeWhere = "WHERE el.user_id = ?";
  let exchangeParams: any[] = [userId];
  if (search) {
    exchangeWhere += " AND m.material LIKE ?";
    exchangeParams.push(`%${search}%`);
  }
  if (startDate) {
    exchangeWhere += " AND el.timestamp >= ?";
    exchangeParams.push(startDate);
  }
  if (endDate) {
    exchangeWhere += " AND el.timestamp <= ?";
    exchangeParams.push(endDate);
  }

  let redeemWhere = "WHERE rr.user_id = ?";
  let redeemParams: any[] = [userId];
  if (search) {
    redeemWhere += " AND r.reward_name LIKE ?";
    redeemParams.push(`%${search}%`);
  }
  if (status && status.length > 0) {
    const placeholders = status.map(() => "?").join(",");
    redeemWhere += ` AND rr.status IN (${placeholders})`;
    redeemParams.push(...status);
  }
  if (startDate) {
    redeemWhere += " AND rr.timestamp >= ?";
    redeemParams.push(startDate);
  }
  if (endDate) {
    redeemWhere += " AND rr.timestamp <= ?";
    redeemParams.push(endDate);
  }

  let exchangeCount = 0;
  let redeemCount = 0;

  if (type !== 'redeem') {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM exchange_log el JOIN material m ON el.material_id = m.material_id ${exchangeWhere}`,
      exchangeParams
    );
    exchangeCount = (rows[0] as any).total;
  }

  if (type !== 'exchange') {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM redeem_request rr INNER JOIN reward_variation rv ON rr.variation_id = rv.variation_id INNER JOIN reward r ON r.reward_id = rv.reward_id ${redeemWhere}`,
      redeemParams
    );
    redeemCount = (rows[0] as any).total;
  }

  return exchangeCount + redeemCount;
}
