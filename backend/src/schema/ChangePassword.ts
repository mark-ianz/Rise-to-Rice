import { z } from "zod";

const minPasswordLength = Number(process.env.MINIMUM_PASSWORD_LENGTH);

export const ChangePasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(1, { message: "Current password is required." }),
  new_password: z.string().min(minPasswordLength, {
    message: `Password must be at least ${minPasswordLength} characters long.`,
  }),
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
