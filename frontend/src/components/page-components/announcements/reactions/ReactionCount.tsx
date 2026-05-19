import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useGetAnnouncementReactions } from "@/hooks/query/useReactions";
import { SmilePlus } from "lucide-react";
import ReactionsList from "./ReactionsList";
import { useState } from "react";
import GetReactionIcon from "../GetReactionIcon";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  announcement_id: string;
};

export default function ReactionCount({ announcement_id }: Props) {
  const { data: reactions, isLoading } =
    useGetAnnouncementReactions(announcement_id);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("announcements");

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 select-none">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="w-16 h-3 rounded animate-pulse bg-slate-100" />
      </div>
    );
  }

  if (!reactions || reactions.length === 0) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium select-none">
        <SmilePlus className="w-4 h-4 text-slate-300" />
        {t("reactions_list.no_reactions", "Be the first to react!")}
      </span>
    );
  }

  // Get unique reaction types present on this post
  const uniqueReactions = Array.from(new Set(reactions.map((r) => r.reaction)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer group select-none w-fit">
          
          {/* Overlapping Reaction Badges */}
          <div className="flex -space-x-1.5 overflow-hidden">
            {uniqueReactions.slice(0, 3).map((reactName) => (
              <div 
                key={reactName} 
                className="flex items-center justify-center bg-white rounded-full p-1 border border-slate-100 shadow-sm w-7 h-7 hover:scale-110 hover:z-10 transition-transform duration-200"
              >
                <GetReactionIcon reaction={reactName} className="w-4 h-4" />
              </div>
            ))}
          </div>

          {/* Reaction Count Text */}
          <span className="text-xs text-slate-500 font-semibold group-hover:text-emerald-600 transition-colors">
            {reactions.length} {reactions.length === 1 ? "reaction" : "reactions"}
          </span>

        </div>
      </DialogTrigger>
      <ReactionsList reactions={reactions} announcement_id={announcement_id} />
    </Dialog>
  );
}
