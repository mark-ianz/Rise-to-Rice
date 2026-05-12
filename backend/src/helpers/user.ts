import { Connection, Pool } from "mysql2/promise";
import { AccountInfo } from "../types/account_info.types";

export async function getUser(connection: Pool | Connection, id: string) {
  const [result] = await connection.query<AccountInfo[]>(
    // this query is to select all from account and user table except password
    `SELECT 
      a.account_id, 
      a.email, 
      a.user_id,
      u.*,
      r.role_name AS role
      FROM account AS a 
      INNER JOIN user AS u 
      ON u.user_id = a.user_id
      INNER JOIN user_role AS ur
      ON ur.user_id = u.user_id
      INNER JOIN role AS r
      ON ur.role_id = r.role_id
      WHERE u.user_id = ?`,
    [id] // using prepared statement to avoid injection
  );

  return result[0];
}
