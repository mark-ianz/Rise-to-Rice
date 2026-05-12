import { z } from "zod";

export const ManipulatePointsSchema = z.object({
  user_id: z.number(),
  points_to_manipulate: z
    .number()
    .min(1, "Points to add must be greater than 0.")
    .positive("Points to add must be greater than 0."),
  reason: z.string().min(1, "Reason must not be empty."),
  manipulation_type: z.enum(["add", "deduct"]),
});

export type ManipulatePoints = z.infer<typeof ManipulatePointsSchema>;