import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z
    .string({ message: "Invalid password." })
    .min(1, { message: "Password is required." }),
});

export type Login = z.infer<typeof LoginSchema>;
