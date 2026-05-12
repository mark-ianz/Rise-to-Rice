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

  // so if the user already reacted to the post, show the reaction icon
  // the user can click on the icon to remove the reaction
  // otherwise show the default react button
  // similar to facebook's react button

  const handleRemoveReaction = () => {
    if (!userReacted) return;

    mutate(userReacted.reaction_id);
  };

  if (hasReacted) {
    return (
      hasReacted && (
        <TooltipProvider>
          <Tooltip>
            <TooltipContent>
              {t("button.reacted") + " "}
              <span className="font-semibold">{userReacted.reaction}</span>
            </TooltipContent>
            <TooltipTrigger asChild>
              <Button
                size={"sm"}
                variant={"secondary"}
                className="min-w-20"
                onClick={handleRemoveReaction}
              >
                <GetReactionIcon reaction={userReacted.reaction} />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      )
    );
  }

  if (!state.user_id) {
    return (
      <RequiredAuthPopup>
        <Button size={"sm"} variant={"secondary"} className="min-w-20">
          <SmilePlus />
          <span>{t("button.react")}</span>
        </Button>
      </RequiredAuthPopup>
    );
  }

  return (
    <PopoverTrigger asChild>
      <Button
        variant={"secondary"}
        onClick={() => setOpen(true)}
        className="min-w-20"
        disabled={!!userReacted}
        size={"sm"}
      >
        <SmilePlus />
        <span>{t("button.react")}</span>
      </Button>
    </PopoverTrigger>
  );
}
