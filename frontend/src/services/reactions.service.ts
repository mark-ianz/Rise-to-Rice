import { axiosError } from "@/helper/errorHandler";
import { ReactedUser, Reaction, ReactionQuery } from "@/types/reactions";
import axios from "axios";

export async function get_announcement_reactions(announcement_id: string) {
  try {
    const response = await axios.get<ReactionQuery[]>(
      "/api/reactions/" + announcement_id
    );
    return response.data;
  } catch (error) {
    axiosError(error);
  }
}

export async function remove_reaction(reaction_id: number) {
  try {
    const response = await axios.delete<ReactionQuery>(
      `/api/reactions/${reaction_id}`
    );
    return response.data;
  } catch (error) {
    axiosError(error);
  }
}

export async function react_to_announcement (
  reaction: Reaction,
  announcement_id: string
): Promise<ReactionQuery> {
  const result = await axios.post<ReactionQuery>("/api/reactions", {
    announcement_id,
    reaction,
  });

  return result.data;
}

export async function get_users_who_reacted(announcement_id: string, reaction: Reaction | "all") {
  try {
    const response = await axios.get<ReactedUser[]>(
      "/api/reactions/users/" + announcement_id, {
        params: { reaction },
      }
    );
    return response.data;
  } catch (error) {
    axiosError(error);
  }
}