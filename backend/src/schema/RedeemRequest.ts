import { z } from "zod";

export const RedeemReqeustSchema = z.object({
  redeem_request_id: z.number(),
  user_id: z.number(),
  reward_id: z.number(),
  status: z.enum(["pending", "working", "for pick up", "completed", "rejected", "cancelled"]),
  timestamp: z.date(),
  admin_notes: z.string().nullable().optional(),
  cancel_reason: z.string().nullable().optional(),
  nano_id: z.string().nullable().optional(),
});

export const CreateRedeemRequestSchema = z.object({
  user_id: z.number(),
  variation_id: z.number(),
  points_cost: z.number(),
});

export const UpdateRedeemRequestStatusSchema = z.object({
  new_status: z.enum(
    ["pending", "working", "for pick up", "completed", "rejected", "cancelled"],
    {
      message: "Invalid status",
    }
  ),
  current_status: z.enum(
    ["pending", "working", "for pick up", "completed", "rejected", "cancelled"],
    {
      message: "Invalid status",
    }
  ),
  email: z.string().email(),
  points_cost: z.number(),
  user_id: z.number(),
  admin_notes: z.string().optional(),
});

export const CancelRedeemRequestSchema = z.object({
  points_cost: z.number(),
  cancel_reason: z.string().min(1, "Reason is required"),
});

export type RedeemRequest = z.infer<typeof RedeemReqeustSchema>;
export type CreateRedeemRequest = z.infer<typeof CreateRedeemRequestSchema>;
