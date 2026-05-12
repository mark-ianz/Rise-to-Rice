import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type Props = {
  children: ReactNode | string;
  content: ReactNode | string;
  contentClassName?: string;
};

export default function TooltipComponent({
  children,
  content,
  contentClassName,
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent sideOffset={4} className={contentClassName}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
