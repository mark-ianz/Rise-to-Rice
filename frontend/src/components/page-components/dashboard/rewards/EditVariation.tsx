import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Edit } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export default function EditVariation({ setIsEditing }: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <Edit />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
