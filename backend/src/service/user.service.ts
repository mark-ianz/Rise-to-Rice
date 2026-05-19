import { ResultSetHeader } from "mysql2";
import { Connection, Pool, PoolConnection } from "mysql2/promise";
import { UserCreate } from "../schema/UserCreate";

export async function createUserData(
  connection: PoolConnection,
  user: UserCreate
) {
  // insert the data and destructure the result to get insertId
  const [{ insertId }] = await connection.query<ResultSetHeader>(
    "INSERT INTO user (first_name, middle_name, last_name, suffix, gender, address, birthdate, contact_number, preferred_language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", // using prepared statement to avoid injection
    [
      user.first_name,
      user.middle_name,
      user.last_name,
      user.suffix || null,
      user.gender,
      user.address,
      user.birthdate,
      user.contact_number,
      user.preferred_language || "en",
    ]
  );

  return insertId;
}

export async function createAccount(
  connection: PoolConnection,
  userId: number,
  user: UserCreate,
  password: string
) {
  // insert the data into account and use the insertId for foreign key
  await connection.query<ResultSetHeader>(
    "INSERT INTO `account` (`user_id`, `email`, `password`) VALUES (?, ?, ?)",
    [userId, user.email, password]
  );
}

export async function queryAllUsers(
  connection: Pool | Connection,
  limit: number,
  offset: number,
  whereClause?: {
    statement: string;
    values: (string | number)[];
  }
) {
  const [users] = await connection.query(
    `SELECT u.*, a.email, r.role_name AS role FROM user AS u
      INNER JOIN account AS a
      ON u.user_id = a.user_id
      INNER JOIN user_role AS ur
      ON ur.user_id = u.user_id
      INNER JOIN role AS r
      ON ur.role_id = r.role_id
      ${whereClause?.statement || ""}
      ORDER BY user_id DESC
      LIMIT ? OFFSET ?
    `,
    whereClause ? [...whereClause.values, limit, offset] : [limit, offset]
  );

  return users;
}
