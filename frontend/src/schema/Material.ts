import { z } from "zod";

export const AddMaterialSchema = z.object({
  material: z.string().min(1, "Material is required"),
  points_per_kg: z.number().refine((val) => val > 0, {
    message: "Points exchange rate must be greater than 0",
  }),
  category_id: z.number().min(1, "Category is required"),
});

// include all but from AddMaterialSchema but add an additional material_id
export const EditMaterialSchema = AddMaterialSchema.omit({
  category_id: true,
}).extend({
  material_id: z
    .number({ message: "Material ID should be a number." })
    .min(1, "Material ID is required"),
});

export type EditMaterial = z.infer<typeof EditMaterialSchema>;
export type AddMaterial = z.infer<typeof AddMaterialSchema>;
