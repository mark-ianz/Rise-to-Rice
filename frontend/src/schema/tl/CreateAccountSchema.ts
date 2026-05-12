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
    .min(1, { message: "Pangalan ay kailangan" })
    .refine(
      (first_name) => {
        if (first_name === "") return true;
        return /^[a-zA-Z\s]+$/.test(first_name);
      },
      {
        message: "Pangalan ay dapat mga letra lamang",
      }
    ),
  middle_name: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[a-zA-Z\s]+$/.test(val), {
      message: "Gitnang pangalan ay dapat mga letra lamang",
    }),
  last_name: z
    .string()
    .trim()
    .min(1, { message: "Apelyido ay kailangan" })
    .refine(
      (last_name) => {
        if (last_name === "") return true;
        return /^[a-zA-Z\s]+$/.test(last_name);
      },
      {
        message: "Apelyido ay dapat mga letra lamang",
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
    message: "Hindi wasto ang kasarian",
  }),
  address: z.string().trim().min(1, { message: "Tirahan ay kailangan" }),
  contact_number: z
    .string()
    .trim()
    .length(contact_number_length, {
      message: "Numbero ng telepono ay dapat 11 na numero",
    })
    .refine((p) => !p || /^\d+$/.test(p), {
      message: "Numbero ng telepono ay dapat mga numero lamang",
    }),
  birthdate: z
    .string({ message: "Kaarawan ay kailangan" })
    .min(1, { message: "Kaarawan ay kailangan" }),
});

export const UserCreate_Second_Part_Schema = z
  .object({
    email: z.string().trim().email({ message: "Hindi wasto ang email" }),
    password: z
      .string()
      .trim()
      .min(min_password_length, {
        message: `Password ay dapat mahigit sa ${min_password_length} na karakter.`,
      }),
    confirm_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        message: "Hindi tugma ang password",
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
        message: `Ang password ay dapat mahigit sa ${min_password_length} na karakter.`,
      }),
    confirm_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        message: "Hindi tugma ang password",
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
