export type Reaction = "Like" | "Heart" | "Haha" | "Wow" | "Sad" | "Angry";

export type ReactionQuery = {
  announcement_id: string;
  user_id?: number;
  reaction: Reaction;
  reaction_id: number;
};

export type ReactedUser = {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  suffix?: string | null;
  reaction: Reaction;
  user_id?: number;
  timestamp: Date;
};
