import { z } from "zod";

export const VerifyVerificationCodeSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: "Email is required." })
    .max(255, { message: "Email must be less than 255 characters." }),
  code: z
    .string()
    .min(6, { message: "Code must be 6 characters." })
    .max(6, { message: "Code must be 6 characters." }),
  type: z.enum(["register", "forgot-password"], {
    errorMap: () => ({
      message: "Type must be either register or forgot-password.",
    }),
  }),
});

export const RequestVerificationCodeSchema = VerifyVerificationCodeSchema.omit({
  code: true,
})

export type RequestVerificationCode = z.infer<typeof RequestVerificationCodeSchema>;
export type VerifyVerificationCode = z.infer<typeof VerifyVerificationCodeSchema>;