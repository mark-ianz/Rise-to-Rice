import { z } from "zod";

export const AddMaterialSchema = z.object({
  material: z.string().trim().min(1, "Material is required"),
  points_per_kg: z.number().positive("Points exchange rate must be positive"),
  category_id: z.number().min(1, "Category is required"),
});

export const EditMaterialSchema = AddMaterialSchema.omit({
  category_id: true,
});

export type AddMaterial = z.infer<typeof AddMaterialSchema>;
