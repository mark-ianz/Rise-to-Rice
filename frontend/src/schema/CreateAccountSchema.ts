import { z } from "zod";

const min_password_length = Number(
  import.meta.env.VITE_MINIMUM_PASSWORD_LENGTH
);
const contact_number_length = Number(
  import.meta.env.VITE_CONTACT_NUMBER_LENGTH
);

export const UserCreate_First_Part_Schema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .refine(
      (first_name) => {
        if (first_name === "") return true;
        return /^[a-zA-Z\s]+$/.test(first_name);
      },
      {
        message: "First name must only contain letters",
      }
    ),
  middle_name: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[a-zA-Z\s]+$/.test(val), {
      message: "Middle name must only contain letters",
    }),
  last_name: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .refine(
      (last_name) => {
        if (last_name === "") return true;
        return /^[a-zA-Z\s]+$/.test(last_name);
      },
      {
        message: "Last name must only contain letters",
      }
    ),
  suffix: z
    .string()
    .transform((suffix) => (suffix === "None" ? null : suffix))
    .refine((suffix) =>
      [null, "Jr.", "Sr.", "II", "III", "IV", "V"].includes(suffix)
    )
    .or(z.literal(null))
    .optional(),
  gender: z.enum(["male", "female", "prefer not to say"], {
    message: "Invalid gender.",
  }),
  address: z.string().trim().min(1, { message: "Address is required" }),
  contact_number: z
    .string()
    .trim()
    .length(contact_number_length, {
      message: "Contact number must be 11 digits",
    })
    .refine((p) => !p || /^\d+$/.test(p), {
      message: "Contact number must only contain digits",
    }),
  birthdate: z
    .string({ message: "Birthdate is required." })
    .min(1, { message: "Birthdate is required." }),
});

export const UserCreate_Second_Part_Schema = z
  .object({
    email: z.string().trim().email({ message: "Invalid email." }),
    password: z
      .string()
      .trim()
      .min(min_password_length, {
        message: `Password must be at least ${min_password_length} characters.`,
      }),
    confirm_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        message: "Passwords do not match.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(min_password_length, {
        message: `Password must be at least ${min_password_length} characters.`,
      }),
    confirm_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        message: "Passwords do not match.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type PasswordReset = z.infer<typeof PasswordResetSchema>;

export type UserCreate_First_Part = z.infer<
  typeof UserCreate_First_Part_Schema
>;
export type UserCreate_Second_Part = z.infer<
  typeof UserCreate_Second_Part_Schema
>;
