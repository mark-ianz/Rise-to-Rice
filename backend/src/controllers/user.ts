/// <reference path="../types/express/index.d.ts" />

import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { UserCreate, UserCreateSchema } from "../schema/UserCreate";
import {
  handleZodErrors,
  isQueryError,
  throwServerError,
} from "../helpers/errorHandlers";
import pool from "../connection/database";
import { comparePassword, hashPassword } from "../helpers/hash";
import { z, ZodError } from "zod";
import {
  createAccount,
  createUserData,
  queryAllUsers,
} from "../service/user.service";
import { UserUpdate, UserUpdateSchema } from "../schema/UserUpdate";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { saveToActionLog } from "../service/admin.service";
import { login } from "../helpers/login";
import { getUser } from "../helpers/user";
import { Account, Role, User } from "../types/account_info.types";
import { PaginationParams } from "../types/params";
import { checkForPagination } from "../helpers/query";
import dayjs from "dayjs";
import {
  RequestVerificationCode,
  RequestVerificationCodeSchema,
  VerifyVerificationCode,
  VerifyVerificationCodeSchema,
} from "../schema/VerificationCode";
import { sendEmail } from "../helpers/mailer";
import { ResetPassword, ResetPasswordSchema } from "../schema/PasswordReset";

const PASSWORD_RESET_PROOF_TTL_MINUTES = 10;

function sendResetProofError(
  res: Response,
  message:
    | "Password reset verification is required."
    | "Password reset proof has expired."
    | "Password reset proof is invalid."
) {
  res.status(403).json({
    errors: [{ message }],
  });
}

export async function createUser(
  req: Request<{}, {}, UserCreate>,
  res: Response
) {
  const connection = await pool.getConnection();
  try {
    // destructure the datas from zod
    const user = UserCreateSchema.parse(req.body);

    // start the transaction
    await connection.beginTransaction();

    // create user data through service and get back the insertId
    const insertId = await createUserData(connection, user);

    // hash the password
    const hashedPassword = hashPassword(user.password);

    // insert to account table
    await createAccount(connection, insertId, user, hashedPassword);

    // insert on user_role table a default role
    await connection.query(
      "INSERT INTO user_role (role_id, user_id) VALUES (?, ?)",
      [3, insertId]
    );

    // initiate points for the user
    await connection.query(
      "INSERT INTO points (points_accumulated, user_id) VALUES (?, ?)",
      [0, insertId]
    );

    // auto login the user after creating the account
    await login(connection, user.email, user.password, req, res);

    // commit the data if all queries are success
    await connection.commit();

    res.status(201).json(req.user);
    return;
  } catch (error: unknown) {
    // if there was an error, the query will rollback and won't save the previous query before error
    await connection.rollback();

    console.log(error);

    // check if zod error
    if (error instanceof z.ZodError) {
      handleZodErrors(error, res);
      return;
    }

    // check if duplicate error
    if (isQueryError(error) && error.code === "ER_DUP_ENTRY") {
      res.status(422).json({ errors: [{ message: "Email is already taken" }] });
      return;
    }

    // throw server error if it's not zod error
    throwServerError(res);
  } finally {
    // if there was a connection found wether the query fails or not, release it after the try/catch block
    if (connection) connection.release();
  }
}

export async function getAccountInfo(
  req: Request<{ id: string }>,
  res: Response
) {
  // try catch block for querying
  try {
    const { id } = req.params;

    // array destructure the result
    const user = await getUser(pool, id);

    // if no user found give back 404 status
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    throwServerError(res); // error thrower lang 'to
  }
}

export async function updateUserInfo(
  req: Request<{ id: string }, {}, UserUpdate>,
  res: Response
) {
  const connection = await pool.getConnection();
  const user_id = req.params.id;

  try {
    const parsedBody = UserUpdateSchema.parse(req.body);
    // initiate the fields, values, and updated_keys array
    const fields: string[] = []; // fields to update e.g: [first_name = ?, last_name = ?]
    const values: any[] = []; // values to update e.g: ["John", "Doe"]
    const updated_keys: string[] = []; // updated keys e.g: ["first_name", "last_name"] (this is for logging purposes)

    // loop through the parsedBody and push the available values to fields and values array
    Object.keys(parsedBody).forEach((key) => {
      // if the key is reason (since the reason key is for logging action_log and not to be pushed on user database), skip the iteration
      if (key === "reason") return;

      // push the values to the fields, values, and updated_keys array
      updated_keys.push(key);
      fields.push(`${key} = ?`);
      values.push(parsedBody[key as keyof UserUpdate]);
    });

    if (fields.length <= 0 || values.length <= 0) {
      res.status(400).json({ error: "No fields to update." });
      return;
    }

    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE user SET ${fields.join(", ")} WHERE user_id = ?`,
      [...values, user_id]
    );

    if (result.affectedRows <= 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // if the one that is updating is the admin, save it to the action log
    if (req.user?.isAdmin) {
      saveToActionLog(connection, "update_user", req.user!.user_id, {
        user_id: user_id,
        updated_values: updated_keys.join(", "),
        reason: parsedBody.reason,
      });
    }

    const updated_user = await getUser(connection, user_id);

    await connection.commit();

    res.json(updated_user);
  } catch (error) {
    await connection.rollback();

    console.log(error);

    if (error instanceof z.ZodError) {
      handleZodErrors(error, res);
      return;
    }
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }

  return;
}

export async function updateUserRole(
  req: Request<{ id: string; role_id: string }>,
  res: Response
) {
  const connection = await pool.getConnection();
  const user_id = req.params.id;
  const role_id = req.params.role_id;

  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE user_role SET role_id = ? WHERE user_id = ?",
      [role_id, user_id]
    );

    if (result.affectedRows <= 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    saveToActionLog(connection, "update_user_role", req.user!.user_id, {
      user_id: user_id,
      role_id: role_id,
    });

    const newUser = await getUser(connection, user_id);

    await connection.commit();

    res.json(newUser);
  } catch (error) {
    console.log(error);
    await connection.rollback();
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }

  return;
}

export async function searchForUser(
  req: Request<{}, {}, {}, PaginationParams & { roles: Role[] }>,
  res: Response
) {
  const { search, searchFor, roles } = req.query;

  let whereClause: { statement: string; values: any[] } = {
    statement: "",
    values: [],
  };

  if (searchFor) {
    switch (searchFor) {
      case "name":
        whereClause = {
          values: [`%${search}%`],
          statement: `
            WHERE CONCAT(u.first_name, ' ', u.last_name) LIKE ?`,
        };
        break;
      case "user_id":
        whereClause = {
          values: [`%${search}%`],
          statement: "WHERE u.user_id LIKE ?",
        };
        break;
      case "email":
        whereClause = {
          values: [`%${search}%`],
          statement: "WHERE a.email LIKE ?",
        };
        break;
      case "contact_number":
        whereClause = {
          values: [`%${search}%`],
          statement: "WHERE u.contact_number LIKE ?",
        };
        break;
    }
  }

  if (roles && roles.length > 0) {
    const role_and_ids = [
      {
        role_name: "super_admin",
        role_id: 1,
      },
      {
        role_name: "admin",
        role_id: 2,
      },
      {
        role_name: "user",
        role_id: 3,
      },
    ];

    const role_ids = roles.map((role) => {
      return role_and_ids.find((r) => r.role_name === role)!.role_id;
    });

    // this maps to the roles and put ? each
    const placeholder = roles.map(() => "?").join(", ");

    // if there was an existing whereClause, append with AND else use WHERE
    const statement = whereClause.statement
      ? whereClause.statement + ` AND r.role_id IN (${placeholder})`
      : `WHERE r.role_id IN (${placeholder})`;

    // manipulate the whereClause
    whereClause = {
      statement,
      // spread the current whereClause values and the status
      values: [...whereClause.values, ...role_ids],
    };
  }

  const pagination = await checkForPagination(
    req.query.page,
    req.query.limit,
    "user AS u",
    "u.user_id",
    whereClause,
    `INNER JOIN account AS a ON a.user_id = u.user_id
    INNER JOIN user_role AS ur ON ur.user_id = u.user_id
    INNER JOIN role AS r ON ur.role_id = r.role_id`
  );

  if (!pagination) {
    res.status(400).json({ error: "Invalid pagination query." });
    return;
  }

  try {
    const users = await queryAllUsers(
      pool,
      pagination.limitInt,
      pagination.offset,
      whereClause
    );

    res.json({
      result: users,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function getAllUser(
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response
) {
  const { page, limit } = req.query;

  const pagination = await checkForPagination(page, limit, "user", "user_id");

  if (!pagination) {
    res.status(400).json({ error: "Invalid pagination query." });
    return;
  }

  try {
    const users = await queryAllUsers(
      pool,
      pagination.limitInt,
      pagination.offset
    );

    res.json({
      result: users,
      page: pagination.pageInt,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total_items: pagination.total_items,
    });
    return;
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response) {
  const connection = await pool.getConnection();
  const user_id = req.params.id;

  try {
    await connection.beginTransaction();

    // check if the user exists in the account table
    const [account] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM account WHERE user_id = ?",
      [user_id]
    );

    if (account.length <= 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // check if the user exists in the user table
    const [user] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE user_id = ?",
      [user_id]
    );

    if (user.length <= 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // if the user exists in the account and user table, delete the user from all the other tables

    // delete the user from user_role table
    await connection.query<ResultSetHeader>(
      "DELETE FROM user_role WHERE user_id = ?",
      [user_id]
    );

    // delete the user from points table
    await connection.query<ResultSetHeader>(
      "DELETE FROM points WHERE user_id = ?",
      [user_id]
    );

    // delete their refresh token
    await connection.query<ResultSetHeader>(
      "DELETE FROM refresh_token WHERE user_id = ?",
      [user_id]
    );

    // delete the user_id from the redeem_request table
    await connection.query<ResultSetHeader>(
      "DELETE FROM redeem_request WHERE user_id = ?",
      [user_id]
    );

    // null the user_id from the action_log
    await connection.query<ResultSetHeader>(
      "UPDATE action_log SET performed_by = NULL WHERE performed_by = ?",
      [user_id]
    );

    // null the user_id from the announcement table
    await connection.query<ResultSetHeader>(
      "UPDATE announcement SET author_id = NULL WHERE author_id = ?",
      [user_id]
    );

    // null the user_id from the exchange_log table
    await connection.query<ResultSetHeader>(
      "UPDATE exchange_log SET user_id = NULL WHERE user_id = ?",
      [user_id]
    );

    // null the user_id from the exchange_log table as logger
    await connection.query<ResultSetHeader>(
      "UPDATE exchange_log SET logged_by = NULL WHERE logged_by = ?",
      [user_id]
    );

    // delete the user from account table
    await connection.query<ResultSetHeader>(
      "DELETE FROM account WHERE user_id = ?",
      [user_id]
    );
    // delete the user from user table
    await connection.query<ResultSetHeader>(
      "DELETE FROM user WHERE user_id = ?",
      [user_id]
    );

    saveToActionLog(connection, "delete_user", req.user!.user_id, {
      user_id: user_id,
    });

    await connection.commit();

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.log(error);
    await connection.rollback();
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }

  return;
}

export async function checkEmailExists(
  req: Request<{}, {}, { email: string }>,
  res: Response
) {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: [{ message: "Email is required." }] });
    return;
  }

  try {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM account WHERE email = ?",
      [email]
    );

    if (result.length > 0) {
      res.json({ exists: true });
      return;
    } else {
      res.json({ exists: false });
      return;
    }
  } catch (error) {
    console.log(error);
    throwServerError(res);
    return;
  }
}

export async function requestVerificationCode(
  req: Request<{}, {}, RequestVerificationCode>,
  res: Response
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { email, type } = RequestVerificationCodeSchema.parse(req.body);

    const now = dayjs();

    // check if a recent verification code exists (less than 2 minute ago)
    const [existingRecords] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM email_verification_code WHERE email = ? AND type = ?",
      [email, type]
    );

    if (existingRecords.length > 0) {
      const existing = existingRecords[0];
      const lastSentTime = dayjs(existing.created_at);

      const diffInSeconds = now.diff(lastSentTime, "second");

      if (diffInSeconds < 120) {
        res.status(429).json({
          errors: [{ message: "Please wait before requesting a new code." }],
        });
        await connection.rollback();
        return;
      }
    }

    // generate a verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedCode = hashPassword(verificationCode);
    const expires_at = now.add(10, "minutes").format("YYYY-MM-DD HH:mm:ss");

    if (type === "forgot-password") {
      // check if the email exists in the account table
      const [account] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM account WHERE email = ?",
        [email]
      );

      if (account.length <= 0) {
        res.status(404).json({
          errors: [{ message: "Email doesn't exist" }],
        });
        return;
      }
    }

    // send the verification code to the user's email
    await sendEmail(
      email,
      type === "register" ? "Verify your email" : "Reset your password",
      `Your verification code is ${verificationCode}`
    );

    if (existingRecords.length > 0) {
      // update if already exists
      await pool.query<ResultSetHeader>(
        "UPDATE email_verification_code SET code = ?, expires_at = ?, created_at = NOW() WHERE email = ? AND type = ?",
        [hashedCode, expires_at, email, type]
      );
    } else {
      // insert if not existing
      await pool.query<ResultSetHeader>(
        "INSERT INTO email_verification_code (email, type, code, expires_at) VALUES (?, ?, ?, ?)",
        [email, type, hashedCode, expires_at]
      );
    }

    await connection.commit();

    res.json({
      message: "Verification code sent to your email.",
    });
    return;
  } catch (error) {
    console.log(error);
    await connection.rollback();

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }
    throwServerError(res);
    return;
  } finally {
    if (connection) connection.release();
  }
}

export async function verifyVerificationCode(
  req: Request<{}, {}, VerifyVerificationCode>,
  res: Response
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const { email, code, type } = VerifyVerificationCodeSchema.parse(req.body);

    // check if the code exists in the database
    const [result] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM email_verification_code WHERE email = ? AND type = ?",
      [email, type]
    );

    if (result.length <= 0 || !comparePassword(code, result[0].code)) {
      throw new ZodError([
        {
          code: "custom",
          message: "Verification code is invalid.",
          path: [],
        },
      ]);
    }

    // check if the code is expired
    const expires_at = result[0].expires_at;
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

    if (dayjs(now).isAfter(dayjs(expires_at))) {
      res
        .status(400)
        .json({ error: [{ message: "Verification code expired." }] });
      return;
    }

    if (type === "forgot-password") {
      const resetToken = randomBytes(32).toString("hex");
      const hashedResetToken = hashPassword(resetToken);
      const resetExpiresAt = dayjs()
        .add(PASSWORD_RESET_PROOF_TTL_MINUTES, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");

      await connection.query<ResultSetHeader>(
        "UPDATE email_verification_code SET code = ?, expires_at = ?, created_at = NOW() WHERE email = ? AND type = ?",
        [hashedResetToken, resetExpiresAt, email, type]
      );

      await connection.commit();

      res.status(200).json({
        message: "Verification code verified successfully.",
        reset_token: resetToken,
      });
      return;
    }

    // delete the verification code from the database
    await connection.query<ResultSetHeader>(
      "DELETE FROM email_verification_code WHERE email = ? AND type = ?",
      [email, type]
    );

    await connection.commit();

    res.status(200).json({
      message: "Verification code verified successfully.",
    });
    return;
  } catch (error) {
    await connection.rollback();
    console.log(error);

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
    return;
  } finally {
    if (connection) connection.release();
  }
}

export async function resetPassword(
  req: Request<{}, {}, ResetPassword>,
  res: Response
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { email, password, reset_token } = ResetPasswordSchema.parse(req.body);

    const [resetProofResult] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM email_verification_code WHERE email = ? AND type = ?",
      [email, "forgot-password"]
    );

    if (resetProofResult.length <= 0) {
      await connection.rollback();
      sendResetProofError(res, "Password reset verification is required.");
      return;
    }

    const resetProof = resetProofResult[0];
    const now = dayjs();

    if (now.isAfter(dayjs(resetProof.expires_at))) {
      await connection.query<ResultSetHeader>(
        "DELETE FROM email_verification_code WHERE email = ? AND type = ?",
        [email, "forgot-password"]
      );
      await connection.commit();
      sendResetProofError(res, "Password reset proof has expired.");
      return;
    }

    if (!comparePassword(reset_token, resetProof.code)) {
      await connection.rollback();
      sendResetProofError(res, "Password reset proof is invalid.");
      return;
    }

    // hash the password
    const hashedPassword = hashPassword(password);

    // update the password in the account table
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE account SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    if (result.affectedRows <= 0) {
      await connection.rollback();
      res.status(404).json({ errors: [{ message: "Account not found." }] });
      return;
    }

    await connection.query<ResultSetHeader>(
      "DELETE FROM email_verification_code WHERE email = ? AND type = ?",
      [email, "forgot-password"]
    );

    await connection.commit();

    res.status(200).json({
      message: "Password reset successfully.",
    });
    return;
  } catch (error) {
    console.log(error);
    await connection.rollback();

    if (error instanceof ZodError) {
      handleZodErrors(error, res);
      return;
    }

    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
}

export async function changePassword(
  req: Request<{ id: string }, {}, { password: string; new_password: string }>,
  res: Response
) {
  const connection = await pool.getConnection();
  const user_id = req.params.id;

  const { password, new_password } = req.body;
  try {
    await connection.beginTransaction();

    // check if the user exists in the account table
    const [account] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM account WHERE user_id = ?",
      [user_id]
    );

    if (account.length <= 0) {
      res.status(404).json({ error: ["User not found."] });
      return;
    }

    console.log(password)
    // check if the password is correct
    if (!comparePassword(password, account[0].password)) {
      res.status(401).json({ error: ["Incorrect password."] });
      return;
    }

    // hash the new password
    const hashedPassword = hashPassword(new_password);

    // update the password in the account table
    await connection.query<ResultSetHeader>(
      "UPDATE account SET password = ? WHERE user_id = ?",
      [hashedPassword, user_id]
    );

    await connection.commit();

    res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);
    await connection.rollback();
    throwServerError(res);
  } finally {
    if (connection) connection.release();
  }
}
