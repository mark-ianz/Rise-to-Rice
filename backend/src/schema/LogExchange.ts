import { z } from "zod";

export const LogExchangeSchema = z.object({
  user_id: z.number().min(1, "User ID is required"),
  material_id: z.number().min(1, "Material ID is required"),
  weight: z.number(),
  points_added: z.number()
});

export type LogExchange = z.infer<typeof LogExchangeSchema>;