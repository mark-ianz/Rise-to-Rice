import InputText from "@/components/general/InputText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import SelectUnit from "../SelectUnit";
import { Unit } from "@/types/rewards";
import { Label } from "@/components/ui/label";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { toast } from "sonner";
import { useAddReward } from "@/hooks/query/useRewards";
import { reward_units } from "@/lib/const";

export default function AddReward() {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<Unit>("kg");
  const rewardNameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string[] | null>(null);

  const { mutate, isPending } = useAddReward();

  const handleCreateReward = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rewardNameRef.current) return;
    const rewardName = rewardNameRef.current.value.trim();

    if (!rewardName) {
      setError(["Reward name cannot be empty."]);
      return;
    }

    mutate(
      {
        reward_name: rewardName,
        unit,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Reward created successfully.");
        },
        onError: () => {
          setError(["Failed to create reward. Please try again."]);
        },
      }
    );
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            className="rounded-full max-md:[&_svg]:size-3 max-lg:w-8 max-lg:h-8 max-md:w-7 max-md:h-7"
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add New Reward</TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleCreateReward} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Add New Reward</DialogTitle>
              <DialogDescription>
                This will allow you to create a new reward that can be used in
                the system.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <InputText
                label="Reward Name"
                name="reward-name"
                type="text"
                labelClassname="text-sm"
                ref={rewardNameRef}
              />
              <span>
                <Label className="font-normal" htmlFor="select-unit">
                  Unit
                </Label>
                <SelectUnit
                  units={reward_units as Unit[]}
                  value={unit}
                  onChange={setUnit}
                  className="w-full"
                />
              </span>
              <ZodErrorDisplay error={error} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Create Reward
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
