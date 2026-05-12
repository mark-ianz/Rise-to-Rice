import { z } from "zod";

export const ReactionSchema = z.object({
  user_id: z.number().int(),
  announcement_id: z.number().int(),
  reaction: z.enum(["Like", "Heart", "Haha", "Wow", "Sad", "Angry"]),
});

export const ReactionResponseSchema = ReactionSchema.extend({
  reaction_id: z.number().int(),
  timestamp: z.string(),
})

export type ReactionResponse = z.infer<typeof ReactionResponseSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;
export type ReactionType = Reaction["reaction"];