import { z } from "zod";

export const LogExchangeSchema = z.object({
  points: z.number({message: "Invalid points"}).min(0),
  weight: z.string().refine((value) => !isNaN(Number(value)), {
    message: "Weight must be a number",
  }),
  unit: z.object({
    unit: z.string(),
    conversion: z.number(),
  }),
  selectedMaterial: z.object({
    material: z.string(),
    material_id: z.number(),
    points_per_kg: z.number(),
  }),
});

export type LogExchange = z.infer<typeof LogExchangeSchema>;