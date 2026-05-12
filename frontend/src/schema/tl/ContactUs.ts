import { z } from "zod";

export const ContactUsSchema = z.object({
  first_name: z.string().min(1, "Pangalan ay kailangan"),
  last_name: z.string().min(1, "Apelyido ay kailangan"),
  email: z.string().email("Hindi wasto ang email"),
  message: z.string().min(1, "Ang mensahe ay kailangan"),
});

export type ContactUs = z.infer<typeof ContactUsSchema>;
