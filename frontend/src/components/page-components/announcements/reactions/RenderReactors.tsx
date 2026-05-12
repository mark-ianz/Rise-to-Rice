import DateDifference from "@/components/general/DateDifference";
import { useGetUsersWhoReacted } from "@/hooks/query/useReactions";
import { displayFullName } from "@/lib/format";
import { Reaction } from "@/types/reactions";
import GetReactionIcon from "../GetReactionIcon";

type Props = {
  announcement_id: number;
  reaction: Reaction | "all";
};

export default function RenderReactors({ announcement_id, reaction }: Props) {
  const { data: reacted_user } = useGetUsersWhoReacted(
    announcement_id,
    reaction
  );

  return (
    <ul className="flex flex-col max-h-60 overflow-auto">
      {reacted_user?.map((reaction, index) => (
        <li
          key={index}
          className="flex p-2 hover:bg-muted rounded-md justify-between items-center"
        >
          <span className="flex items-center gap-4">
            <GetReactionIcon className="w-4 h-4" reaction={reaction.reaction} />
            {displayFullName(reaction)}
          </span>
          <DateDifference className="-mt-1" date={reaction.timestamp} />
        </li>
      ))}
    </ul>
  );
}
