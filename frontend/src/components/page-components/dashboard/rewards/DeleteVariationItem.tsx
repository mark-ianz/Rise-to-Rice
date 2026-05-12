import { ConfirmationInput } from "@/components/general/ConfirmationInput";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useDeleteVariation } from "@/hooks/query/useRewards";
import { Trash } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function DeleteVariationItem({ id }: { id: string | number }) {
  const [open, setOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string>("");
  const toInput = `delete variation id #${id}`;
  const isInputValid = deleteConfirm === toInput;

  const { mutate, isPending } = useDeleteVariation();

  const handleDelete = (e: FormEvent) => {
    e.preventDefault();
    mutate(id, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Variation deleted successfully!");
      },
      onError: (error) => {
        console.error("Error deleting variation:", error);
      },
    });
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            variant={"destructive"}
            onClick={() => setOpen(true)}
          >
            <Trash />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleDelete} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this variation?
              </DialogTitle>
              <DialogDescription asChild>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    This action <span className="font-bold">cannot</span> be
                    undone.
                  </li>
                  <li>
                    This will <span className="font-bold">permanently</span>{" "}
                    delete the reward variation and all its data, including all
                    the users who have this reward variation.
                  </li>
                  <li>
                    This may affect the users who have already exchanged this
                    and may result in{" "}
                    <span className="font-bold">data loss.</span>
                  </li>
                </ol>
              </DialogDescription>
              <ConfirmationInput
                error={null}
                actionText="to confirm the deletion of this variation"
                input={toInput}
                onValueChange={(e) => setDeleteConfirm(e.target.value)}
              />
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={"destructive"}
                disabled={isPending || !isInputValid}
                type="submit"
              >
                Yes
              </Button>
              <DialogClose asChild>
                <Button variant={"outline"} disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
