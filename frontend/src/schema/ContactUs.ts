import { z } from "zod";

export const ContactUsSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export type ContactUs = z.infer<typeof ContactUsSchema>;
