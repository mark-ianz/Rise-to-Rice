import { Request, Response } from "express";
import { Account, ReqUser } from "../types/account_info.types";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { comparePassword } from "./hash";
import { Role } from "../types/role";
import { generateAuthToken, generateRefreshToken } from "./jwt";
import { setCookie } from "./cookie";
import { replaceUserRefreshToken } from "./token";

export async function login(
  connection: PoolConnection,
  email: string,
  password: string,
  req: Request,
  res: Response
) {
  // check if user with that email exist
  const [result] = await connection.query<(Account & RowDataPacket)[]>(
    "SELECT * FROM account WHERE email = ?",
    [email]
  );

  // if no user found with the email, throw error
  if (result.length <= 0) {
    res.status(404).json({ error: "Incorrect email or password" });
    return;
  }

  // get the user data
  const userFound = result[0];
  const user_id = userFound.user_id;
  const account_id = userFound.account_id;

  // compare the password and throw error if incorrect
  if (!comparePassword(password, userFound.password!)) {
    res.status(401).json({ error: "Incorrect email or password" });
    return;
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

  // set the cookie with the refresh token
  res.clearCookie("refreshToken");
  setCookie(res, "refreshToken", refreshToken, 1000 * 60 * 60 * 24 * 7);

  // set the cookie with the token
  setCookie(res, "authToken", token, 1000 * 60 * 15);

  // assign the user to req.user
  req.user = user;
}
