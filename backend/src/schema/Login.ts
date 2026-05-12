import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  password: z.string().trim().nonempty({ message: "Password is required" }),
});

export type Login = z.infer<typeof LoginSchema>;
