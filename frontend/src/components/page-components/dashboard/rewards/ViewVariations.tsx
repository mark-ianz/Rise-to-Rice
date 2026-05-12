import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RewardAndVariation } from "@/types/rewards";
import VariationItem from "./VariationItem";
import AddVariationButton from "./AddVariationButton";

type Props = {
  reward: RewardAndVariation;
};

export default function ViewVariations({ reward }: Props) {
  const hasVariations = reward.variations[0].variation_id !== null;

  return (
    <Dialog>
      <DialogTrigger className="text-tertiary underline">View</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <DialogTitle>Reward Variations for {reward.reward_name}</DialogTitle>
          <DialogDescription>
            List of variations for {reward.reward_name} with their respective
            quantity and points cost.
          </DialogDescription>
          {hasVariations ? (
            <ol className="flex flex-col p-2 gap-2 max-h-[45vh] overflow-y-scroll">
              {reward.variations.map((variation, index) => (
                <VariationItem
                  key={variation.variation_id + index}
                  variation={variation}
                  unit={reward.unit}
                />
              ))}
            </ol>
          ) : (
            <p className="text-sm text-tertiary">
              No variations available for this reward.
            </p>
          )}
          <AddVariationButton reward_id={reward.reward_id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
