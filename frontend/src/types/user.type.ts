import { Gender } from "./createAccount.type";

export type Role = "super_admin" | "admin" | "user";

export type UserInitialState = {
  account_id: number | null;
  email: string | null;
  isAdmin: boolean | null;
  role: Role | null;
  user_id: number | null;
};

export type UserProfile = {
  account_id: number;
  email: string;
  user_id: number;
  first_name: string;
  middle_name: string | undefined;
  last_name: string;
  suffix: string;
  gender: Gender;
  address: string;
  birthdate: Date | string;
  contact_number: string;
  createdAt: string;
  role: Role;
};

export type EditProfile = {
  first_name: string;
  middle_name: string | null | undefined;
  last_name: string;
  suffix: string | null;
  gender: Gender;
  address: string;
  contact_number: string;
  birthdate: Date | string;
  isEditing: boolean;
  error: string[];
  createdAt: string;
};

export type BasicInformation = {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string;
  gender: Gender;
  birthdate: Date | string;
};