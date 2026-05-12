import { z } from "zod";

export const RewardVariationSchema = z.object({
  reward_id: z
    .number({message: "Reward ID must be a number."})
    .positive({ message: "Reward ID must be a positive number." }),
  quantity: z
    .number({ message: "Quantity must be a number." })
    .positive({ message: "Quantity must be a positive number." }),
  points_cost: z
    .number({ message: "Points cost must be a number." })
    .positive({ message: "Points must be a positive number." }),
});

export const RewardVariationUpdateSchema = RewardVariationSchema.omit({
  reward_id: true,
});

export type RewardVariationUpdate = z.infer<typeof RewardVariationUpdateSchema>;
export type RewardVariation = z.infer<typeof RewardVariationSchema>;
