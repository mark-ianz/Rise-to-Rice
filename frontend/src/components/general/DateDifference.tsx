import { cn } from "@/lib/utils";
import { formatDate, formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { filipinoLocale } from "@/utils/dateFnsFilipinoLocale";
import { useTranslation } from "react-i18next";

type Props = {
  date: Date | string;
  className?: string;
};

export default function DateDifference({ date, className }: Props) {
  const { i18n } = useTranslation();
  const parsedDate = new Date(date);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <p
            className={cn(
              "text-xs text-tertiary cursor-pointer hover:underline w-fit",
              className
            )}
          >
            {formatDistanceToNow(parsedDate, {
              addSuffix: true,
              locale: i18n.language === "tl" ? filipinoLocale : undefined,
            })}
          </p>
        </TooltipTrigger>
        <TooltipContent className="bg-tertiary opacity-90">
          <p>{formatDate(parsedDate, "EEEE, MMMM dd, yyyy 'at' h:mm aa")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
