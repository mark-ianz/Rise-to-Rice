import InputText from "@/components/general/InputText";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { useAddRewardVariation } from "@/hooks/query/useRewards";
import axios from "axios";
import { Save, X } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function AddVariationButton({
  reward_id,
}: {
  reward_id: number;
}) {
  const [error, setError] = useState<string[] | null>(null);
  const { mutate, isPending } = useAddRewardVariation();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const quantityRef = useRef<HTMLInputElement>(null);
  const pointsCostRef = useRef<HTMLInputElement>(null);

  const handleAddVariation = (e: FormEvent) => {
    e.preventDefault();
    const quantity = quantityRef.current?.value;
    const pointsCost = pointsCostRef.current?.value;

    setError(null); // Reset error state before validation

    if (!quantity || !pointsCost) {
      setError((prev) =>
        prev
          ? [...prev, "Please fill in all fields."]
          : ["Please fill in all fields."]
      );
      return;
    }

    if (isNaN(Number(quantity)) || isNaN(Number(pointsCost))) {
      setError((prev) =>
        prev
          ? [...prev, "Please enter valid numbers."]
          : ["Please enter valid numbers."]
      );
      return;
    }

    mutate(
      { quantity, pointsCost, reward_id },
      {
        onSuccess: () => {
          setIsAdding(false);
          toast.success("Variation added successfully!");
          setError(null); // Reset error state on success
        },
        onError: (error) => {
          console.error("Error adding variation:", error);

          if (axios.isAxiosError(error)) {
            const errors = error.response?.data.errors.map(
              (error: { message: string }) => error.message
            );
            setError((prev) => (prev ? [...prev, ...errors] : [...errors]));
          } else {
            setError((prev) =>
              prev
                ? [...prev, "Error adding variation."]
                : ["Error adding variation."]
            );
          }
        },
      }
    );
  };

  return (
    <>
      {isAdding ? (
        <form onSubmit={handleAddVariation} className="flex flex-col gap-4">
          <div className="flex w-full gap-2">
            <div className="flex gap-2">
              <InputText
                ref={quantityRef}
                label="Quantity"
                wrapperClassName="w-full"
                name="quantity"
                type="text"
                labelClassname="text-sm"
              />
              <InputText
                ref={pointsCostRef}
                label="Points Cost"
                wrapperClassName="w-full"
                name="points_cost"
                type="number"
                labelClassname="text-sm"
              />
            </div>
            <div className="flex gap-2 items-end">
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipContent>Save</TooltipContent>
                  <TooltipTrigger asChild>
                    <Button size={"icon"} type="submit" disabled={isPending}>
                      <Save />
                    </Button>
                  </TooltipTrigger>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipContent>Cancel</TooltipContent>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isPending}
                      size={"icon"}
                      variant={"destructive"}
                      onClick={() => setIsAdding(false)}
                    >
                      <X />
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <ZodErrorDisplay error={error} />
        </form>
      ) : (
        <Button onClick={() => setIsAdding(true)}>Add Variation</Button>
      )}
    </>
  );
}
