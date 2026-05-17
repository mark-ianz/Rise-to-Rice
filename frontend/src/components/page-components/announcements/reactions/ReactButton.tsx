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
        sideOffset={8}
        className="flex gap-1.5 w-auto p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.08)] animate-[fadeSlideUp_0.15s_ease-out] z-50 pointer-events-auto"
      >
        <TooltipProvider>
          {reactions.map((reaction, index) => (
            <Tooltip delayDuration={150} key={reaction + index}>
              <TooltipTrigger asChild autoFocus={false}>
                <button
                  disabled={isPending}
                  className="rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300 hover:scale-135 hover:-translate-y-1.5 hover:bg-slate-50 focus:outline-none"
                  onClick={() => handleReact(reaction)}
                >
                  <GetReactionIcon reaction={reaction} className="w-7 h-7 sm:w-8 sm:h-8" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-md border-0 mb-1">
                {reaction}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}
