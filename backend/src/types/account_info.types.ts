import { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

export type Account = {
  account_id: number;
  user_id: number;
  email: string;
  password?: string;
};

export type ReqUser = Partial<JwtPayload> & {
  email: string;
  user_id: number;
  account_id: number;
  isAdmin: boolean;
  role: Role;
};

export type Role = "user" | "admin" | "super_admin";

export type User = {
  user_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  gender: "male" | "female" | "prefer not to say";
  address: string;
  contact_number: string;
  birthdate: Date;
  createdAt: Date;
  role: Role;
};

export type AccountInfo = Account & User & RowDataPacket;
