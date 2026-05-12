import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RewardAndVariation, Unit } from "@/types/rewards";
import InputText from "@/components/general/InputText";
import SelectUnit from "../SelectUnit";
import { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import LoadingComponent from "@/components/general/LoadingComponent";
import { useEditReward } from "@/hooks/query/useRewards";
import { reward_units } from "@/lib/const";

type Props = {
  reward: RewardAndVariation;
};

export default function EditReward({ reward }: Props) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState(reward.unit);
  const [rewardName, setRewardName] = useState(reward.reward_name);

  const { mutate, isPending } = useEditReward();

  const handleSaveChanges = (e: FormEvent) => {
    e.preventDefault();
    if (!rewardName) return;

    if (rewardName.trim() === reward.reward_name && unit === reward.unit) {
      // No changes made, close the dialog
      setOpen(false);
      return;
    }

    // mutate

    mutate(
      {
        reward_id: reward.reward_id,
        reward_name: rewardName,
        unit: unit,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Reward updated successfully");
        },
        onError: () => {
          toast.error("Something went wrong, please try again later");
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"secondary"}>Edit</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSaveChanges} className="flex flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit {reward.reward_name}</AlertDialogTitle>
            <AlertDialogDescription>
              You can change the name and unit of the{" "}
              <span className="font-bold">{reward.reward_name}</span> here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2">
            <InputText
              label="Reward Name"
              name="reward-name"
              type="text"
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
              labelClassname="text-sm"
            />
            <span>
              <Label className="font-normal" htmlFor="select-unit">
                Unit
              </Label>
              <SelectUnit units={reward_units as Unit[]} value={unit} onChange={setUnit} className="w-full" />
            </span>
          </div>
          <AlertDialogFooter>
            <Button className="min-w-[80px]" disabled={isPending} type="submit">
              {isPending ? <LoadingComponent /> : "Save"}
            </Button>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
