import { z } from "zod";

const minPasswordLength = Number(process.env.MINIMUM_PASSWORD_LENGTH);

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z.string().min(minPasswordLength, {
    message: `Password must be at least ${minPasswordLength} characters long.`,
  }),
  reset_token: z
    .string()
    .trim()
    .min(32, { message: "Reset token is invalid." }),
});

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
