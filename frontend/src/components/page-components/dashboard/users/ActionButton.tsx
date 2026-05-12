import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";
import { ReactNode } from "react";

export default function ActionButton({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Ellipsis className="text-tertiary cursor-pointer ml-auto" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48">
        <div className="flex flex-col gap-2">{children}</div>
      </PopoverContent>
    </Popover>
  );
}
