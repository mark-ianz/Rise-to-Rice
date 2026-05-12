import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import LoadingComponent from "@/components/general/LoadingComponent";
import { toast } from "sonner";
import { useEditRewardVariation } from "@/hooks/query/useRewards";

export type Info = {
  id: string | number;
  points_cost: number;
  quantity: number;
};

type Props = {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  info: Info;
};

export default function SaveVariationItem({ setIsEditing, info }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useEditRewardVariation();

  const handleSave = () => {
    mutate(info, {
      onSuccess: () => {
        setIsEditing(false);
        setOpen(false);
        toast.success("Variation saved successfully!");
      },
      onError: (error) => {
        console.error("Error saving variation:", error);
      },
    });
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={() => setOpen(true)}>
            <Save />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Save</TooltipContent>
      </Tooltip>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to save this variation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will save the changes made to the variation. Please
              confirm to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? <LoadingComponent /> : "Save"}
            </Button>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
