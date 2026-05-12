import { z } from "zod";

export const RedeemReqeustSchema = z.object({
  redeem_request_id: z.number(),
  user_id: z.number(),
  reward_id: z.number(),
  status: z.enum(["pending", "for pick up", "completed"]),
  timestamp: z.date(),
});

export const CreateRedeemRequestSchema = z.object({
  user_id: z.number(),
  variation_id: z.number(),
  points_cost: z.number(),
});

export type RedeemRequest = z.infer<typeof RedeemReqeustSchema>;
export type CreateRedeemRequest = z.infer<typeof CreateRedeemRequestSchema>;
