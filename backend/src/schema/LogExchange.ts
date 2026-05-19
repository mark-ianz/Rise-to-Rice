import { z } from "zod";

export const LogExchangeSchema = z.object({
  user_id: z.coerce.number().min(1, "User ID is required"),
  material_id: z.coerce.number().min(1, "Material ID is required"),
  weight: z.coerce.number(),
  points_added: z.coerce.number()
});

export type LogExchange = z.infer<typeof LogExchangeSchema>;