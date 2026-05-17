import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import {
  useGetAnnouncementReactions,
  useRemoveReaction,
} from "@/hooks/query/useReactions";
import useUserContext from "@/hooks/useUserContext";
import { SmilePlus } from "lucide-react";
import GetReactionIcon from "../GetReactionIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RequiredAuthPopup from "@/components/general/RequiredAuthPopup";
import { useTranslation } from "react-i18next";

type Props = {
  announcement_id: number;
  setOpen: (open: boolean) => void;
};

export default function ReactTrigger({ announcement_id, setOpen }: Props) {
  const { t } = useTranslation("announcements");
  const { data: reactions } = useGetAnnouncementReactions(announcement_id);
  const { state } = useUserContext();

  const { mutate } = useRemoveReaction(announcement_id);

  // check if user has reacted to the post
  const userReacted = reactions?.find(
    (reaction) => reaction.user_id === state.user_id
  );
  const hasReacted = !!userReacted;

  const handleRemoveReaction = () => {
    if (!userReacted) return;
    mutate(userReacted.reaction_id);
  };

  const activePillClass = "rounded-full px-4 h-9 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold hover:bg-emerald-100/70 hover:scale-[1.02] shadow-sm transition-all duration-200";
  const defaultPillClass = "rounded-full px-4 h-9 flex items-center gap-1.5 border border-slate-200/80 bg-white hover:bg-slate-55 hover:border-slate-35 hover:scale-[1.02] text-slate-600 font-semibold shadow-sm transition-all duration-200 [&_svg]:size-4";

  if (hasReacted) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              className={activePillClass}
              onClick={handleRemoveReaction}
            >
              <GetReactionIcon reaction={userReacted.reaction} className="w-4 h-4 animate-bounce" />
              <span className="text-xs">{userReacted.reaction}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow-md border-0 mb-1 font-bold">
            {t("button.reacted")}: <span className="text-emerald-400">{userReacted.reaction}</span> (Click to remove)
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!state.user_id) {
    return (
      <RequiredAuthPopup>
        <Button size={"sm"} className={defaultPillClass}>
          <SmilePlus className="text-slate-400" />
          <span className="text-xs">{t("button.react")}</span>
        </Button>
      </RequiredAuthPopup>
    );
  }

  return (
    <PopoverTrigger asChild>
      <Button
        onClick={() => setOpen(true)}
        disabled={!!userReacted}
        size={"sm"}
        className={defaultPillClass}
      >
        <SmilePlus className="text-slate-400" />
        <span className="text-xs">{t("button.react")}</span>
      </Button>
    </PopoverTrigger>
  );
}
