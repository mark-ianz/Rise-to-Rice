import {
  get_announcement_reactions,
  get_users_who_reacted,
  react_to_announcement,
  remove_reaction,
} from "@/services/reactions.service";
import { Reaction, ReactionQuery } from "@/types/reactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAnnouncementReactions(announcement_id: number) {
  return useQuery({
    queryKey: ["reactions", announcement_id],
    queryFn: () => get_announcement_reactions(announcement_id),
    placeholderData: (prev) => prev,
  });
}

export function useReactToAnnouncement(
  announcement_id: number,
  setOpen: (open: boolean) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["react", announcement_id],
    mutationFn: (reaction: Reaction) =>
      react_to_announcement(reaction, announcement_id),
    onSuccess: (reaction: ReactionQuery) => {
      setOpen(false);

      // added a delay to prevent flickering
      setTimeout(() => {
        queryClient.setQueryData(
          ["reactions", announcement_id],
          (old: Reaction[] = []) => {
            return [...old, reaction];
          }
        );
      }, 150);
    },
    onError: (error) => {
      console.error("Error reacting to post", error);
    },
  });
}

export function useRemoveReaction(announcement_id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-reaction", announcement_id],
    mutationFn: (reaction_id: number) => remove_reaction(reaction_id),
    onSuccess: (_, reaction_id) => {
      queryClient.setQueryData(
        ["reactions", announcement_id],
        (oldData: ReactionQuery[]) => {
          return oldData?.filter(
            (reaction) => reaction.reaction_id !== reaction_id
          );
        }
      );
    },
  });
}

export function useGetUsersWhoReacted(
  announcement_id: number,
  reaction: Reaction | "all"
) {
  return useQuery({
    queryKey: ["reactions-list", announcement_id, reaction],
    queryFn: () => get_users_who_reacted(announcement_id, reaction),
    placeholderData: (prev) => prev,
  });
}
