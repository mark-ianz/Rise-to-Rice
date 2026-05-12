import { z } from "zod";

const min_password_length = Number(process.env.MINIMUM_PASSWORD_LENGTH);
const contact_number_length = Number(process.env.CONTACT_NUMBER_LENGTH);

export const UserCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(min_password_length, {
    message: `Password must be at least ${min_password_length} characters long`,
  }),
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
    .string()
    .min(1, { message: "Birthdate is required." })
    .refine((birthdate) => !isNaN(Date.parse(birthdate)), {
      message: "Invalid format.",
    })
    .transform((birthdate) => new Date(birthdate)),
});

export type UserCreate = z.infer<typeof UserCreateSchema>;
