import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";
import React from "react";

type Props = {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CancelEdit({ setIsEditing }: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipContent>Cancel</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            variant={"destructive"}
            onClick={() => setIsEditing(false)}
          >
            <X />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}
