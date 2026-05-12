import { Reaction, ReactionQuery } from "@/types/reactions";

export type GroupedReactions = {
  [key in Reaction]: ReactionQuery[];
};

export function groupReactionsByType(reactions: ReactionQuery[]): GroupedReactions {
  return reactions.reduce(
    (acc, curr) => {
      if (!acc[curr.reaction]) {
        acc[curr.reaction] = [];
      }
      acc[curr.reaction].push(curr);
      return acc;
    },
    {
      Like: [],
      Heart: [],
      Haha: [],
      Wow: [],
      Sad: [],
      Angry: [],
    } as GroupedReactions
  );
}
