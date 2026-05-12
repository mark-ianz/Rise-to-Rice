import { ConfirmationInput } from "@/components/general/ConfirmationInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteReward } from "@/hooks/query/useRewards";
import { Reward } from "@/types/rewards";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  reward: Reward;
};

export default function DeleteReward({ reward }: Props) {
  const [error, setError] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState(false);

  const neededInput = `delete ${reward.reward_name.toLowerCase()}`;
  const isInputValid = input === neededInput;

  const { mutate, isPending } = useDeleteReward();

  const handleDeleteReward = async () => {
    if (!isInputValid) {
      setError([
        "Please type the exact text to confirm deletion of this reward.",
      ]);
      return;
    }

    mutate(reward.reward_id, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Reward deleted successfully");
      },
      onError: () => {
        toast.error("Something went wrong, please try again later");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure you want to delete this reward?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the reward
          and all its variations.
        </DialogDescription>
        <ConfirmationInput
          error={error}
          actionText="to delete this reward"
          input={neededInput}
          value={input}
          onValueChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <DialogFooter>
          <Button
            disabled={!isInputValid || isPending}
            variant="destructive"
            onClick={handleDeleteReward}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setInput("");
              setError([]);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
