import { z } from "zod";

export const RewardSchema = z.object({
  reward_name: z
    .string()
    .trim()
    .min(1, { message: "Reward name must not be empty." }),
  unit: z.enum(
    ["pc", "g", "kg", "ml", "l", "lb", "oz", "cm", "in", "m", "ft"],
    {
      message: "Invalid unit.",
    }
  ),
});

export type Reward = z.infer<typeof RewardSchema>;
