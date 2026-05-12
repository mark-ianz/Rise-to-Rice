import { ReactedUser } from "@/types/reactions";
import { Unit } from "@/types/rewards";
import { Role, UserProfile } from "@/types/user.type";
import { z } from "zod";

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function displayFullName(user: UserProfile | ReactedUser) {
  if (!user.first_name || !user.last_name) {
    return "Deleted User";
  }

  return `${capitalizeFirstLetter(user.first_name)} ${
    user.middle_name && capitalizeFirstLetter(user.middle_name)
  } ${capitalizeFirstLetter(user.last_name)} ${user.suffix ? user.suffix : ""}`;
}

export function formatUnit(unit: Unit, quantity: number) {
  return unit === "pc" && quantity > 1 ? "pcs" : unit;
}

export function capitalizeWordStart(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatZodErrors(error: z.ZodError) {
  return error.errors.map((err) => err.message);
}

export function getFormattedRole(role: Role) {
  switch (role) {
    case "admin":
      return "Admin";
    case "user":
      return "User";
    case "super_admin":
      return "Super Admin";
    default:
      return role;
  }
}

export function formatNumberWithCommasAndDecimals(
  number: number | string | undefined,
  decimalPlaces: number = 2
) {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  return (number || 0).toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}
