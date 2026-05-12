import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useUserContext from "@/hooks/useUserContext";
import { Reaction } from "@/types/reactions";
import { useState } from "react";
import GetReactionIcon from "../GetReactionIcon";
import { reactions } from "@/lib/const";
import { useReactToAnnouncement } from "@/hooks/query/useReactions";
import ReactTrigger from "./ReactTrigger";

type Props = {
  announcement_id: number;
};

export default function ReactButton({ announcement_id }: Props) {
  const { state } = useUserContext();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useReactToAnnouncement(announcement_id, setOpen);

  const handleReact = (reaction: Reaction) => {
    if (!state.user_id) {
      return;
    }

    mutate(reaction);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <ReactTrigger setOpen={setOpen} announcement_id={announcement_id} />
      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="flex gap-2 w-full p-2 rounded-full"
      >
        <TooltipProvider>
          {reactions.map((reaction, index) => (
            <Tooltip delayDuration={200} key={index}>
              <TooltipContent className="bg-tertiary/60 font-semibold">
                {reaction}
              </TooltipContent>
              <TooltipTrigger asChild autoFocus={false}>
                <Button
                  disabled={isPending}
                  autoFocus={false}
                  key={reaction + index}
                  variant={"secondary"}
                  className="rounded-full [&_svg]:size-6 h-14 max-md:[&_svg]:size-4 max-md:h-12 max-sm:[&_svg]:size-4 max-sm:h-10 max-sm:w-10"
                  onClick={() => handleReact(reaction)}
                >
                  <GetReactionIcon reaction={reaction} />
                </Button>
              </TooltipTrigger>
            </Tooltip>
          ))}
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}
