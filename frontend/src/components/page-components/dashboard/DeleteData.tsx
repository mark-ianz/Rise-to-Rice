import { ConfirmationInput } from "@/components/general/ConfirmationInput";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/format";
import { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

type Props = {
  id: number | string;
  useMutation_hook: () => {
    mutate: (
      id: any,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => void;
    isPending: boolean;
  };
  resource_name: string;
  description: string | ReactNode;
  children?: ReactNode;
};

export default function DeleteData({
  id,
  useMutation_hook,
  resource_name,
  description,
  children,
}: Props) {
  const [confirmationInput, setConfirmationInput] = useState<string>("");
  const [error, setError] = useState<string[] | null>(null);
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation_hook();

  const neededInput = `delete ${resource_name} id #${id}`;
  const isInputValid = confirmationInput === neededInput;

  const handleDelete = (e: FormEvent) => {
    e.preventDefault();
    if (!isInputValid) {
      setError(["Please type 'delete' to confirm deletion."]);
      return;
    }

    mutate(id, {
      onSuccess: () => {
        setError(null);
        setOpen(false);
        toast.success(
          `${capitalizeFirstLetter(resource_name)} deleted successfully`
        );
        setConfirmationInput("");
      },
      onError: () => {
        setError([
          "There was an error deleting the request. Please try again later.",
        ]);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant={"destructive"}>
            Delete {capitalizeFirstLetter(resource_name)}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form className="flex gap-4 flex-col" onSubmit={handleDelete}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this {resource_name}?
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ConfirmationInput
            error={error}
            value={confirmationInput}
            onValueChange={(e) => setConfirmationInput(e.target.value)}
            input={neededInput}
            actionText={`to confirm the deletion of this ${resource_name}`}
          />
          <DialogFooter>
            <Button
              variant={"destructive"}
              type="submit"
              disabled={!isInputValid || isPending}
            >
              Delete
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
  );
}
