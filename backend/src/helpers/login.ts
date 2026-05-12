import { Account, ReqUser } from "../types/account_info.types";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { comparePassword } from "./hash";
import { Role } from "../types/role";
import { generateAuthToken, generateRefreshToken } from "./jwt";
import { replaceUserRefreshToken } from "./token";

export class LoginError extends Error {
  statusCode: 401 | 404;
  responseBody: { error: string };

  constructor(statusCode: 401 | 404, message: string) {
    super(message);
    this.name = "LoginError";
    this.statusCode = statusCode;
    this.responseBody = { error: message };
  }
}

export async function login(
  connection: PoolConnection,
  email: string,
  password: string
) {
  // check if user with that email exist
  const [result] = await connection.query<(Account & RowDataPacket)[]>(
    "SELECT * FROM account WHERE email = ?",
    [email]
  );

  // if no user found with the email, throw error
  if (result.length <= 0) {
    throw new LoginError(404, "Incorrect email or password");
  }

  // get the user data
  const userFound = result[0];
  const user_id = userFound.user_id;
  const account_id = userFound.account_id;

  // compare the password and throw error if incorrect
  if (!comparePassword(password, userFound.password!)) {
    throw new LoginError(401, "Incorrect email or password");
  }

  // check for role
  const [roleQuery] = await connection.query<(Role & RowDataPacket)[]>(
    "SELECT r.role_name FROM role AS r INNER JOIN user_role AS ur ON r.role_id = ur.role_id WHERE ur.user_id = ?",
    [user_id]
  );

  const role = roleQuery[0].role_name;
  const isAdmin = role === "admin" || role === "super_admin";

  // create the user object
  const user: ReqUser = {
    email,
    user_id,
    account_id,
    isAdmin,
    role,
  };

  // initialize the token and refresh token
  const token = generateAuthToken(user);
  const refreshToken = generateRefreshToken(user);

  await replaceUserRefreshToken(connection, user_id, refreshToken);

  return {
    user,
    authToken: token,
    refreshToken,
  };
}
