import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { formatUnit } from "@/lib/format";
import { RewardVariation, Unit } from "@/types/rewards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

type Props = {
  reward_id: number;
  unit: Unit;
  setPointsCost: (points: number) => void;
  setSelectedQuantity: (quantity: string) => void;
  setRewardVariationId: (variation: number) => void;
  selectedQuantity: string;
};

export default function Quantity({
  reward_id,
  unit,
  setPointsCost,
  setRewardVariationId,
  setSelectedQuantity,
  selectedQuantity,
}: Props) {
  const { data: reward_variations } = useQuery<RewardVariation[]>({
    queryKey: ["reward-variations", reward_id],
    queryFn: async () => {
      const response = await axios.get(`/api/reward-variation/${reward_id}`);
      return response.data;
    },
  });

  // set the selected quantity and points cost to the first reward variation
  useEffect(() => {
    if (reward_variations && reward_variations?.length > 0) {
      setSelectedQuantity(reward_variations[0].quantity.toString() || "0");
      setPointsCost(reward_variations[0].points_cost || 0);
      setRewardVariationId(reward_variations[0].variation_id);
    }
  }, [
    reward_variations,
    setPointsCost,
    setSelectedQuantity,
    setRewardVariationId,
  ]);

  if (!reward_variations) {
    return <TableCell>Loading...</TableCell>;
  }

  const handleOnValueChange = (value: string) => {
    // update the selected quantity
    setSelectedQuantity(value);

    // find the selected reward variation
    reward_variations.find((variation) => {
      // if the quantity of the variation is equal to the selected quantity
      // set the points cost to the points cost of the variation
      // and set the reward variation to the selected variation
      if (variation.quantity === parseInt(value)) {
        setPointsCost(variation.points_cost);
        setRewardVariationId(variation.variation_id);
      }
    });
  };

  const isEmpty = reward_variations.length === 0;

  return (
    <TableCell className="flex justify-center">
      <Select value={selectedQuantity} onValueChange={handleOnValueChange}>
        <SelectTrigger
          className="w-fit min-w-[100px] gap-4 bg-secondary-light max-md:min-w-max max-sm:w-[50px] max-sm:gap-1 max-sm:text-xs"
          disabled={isEmpty}
        >
          {!isEmpty
            ? selectedQuantity +
              " " +
              formatUnit(unit, parseInt(selectedQuantity))
            : "N/A"}
        </SelectTrigger>
        <SelectContent>
          {reward_variations.map((variation, index) => (
            <SelectItem key={index} value={variation.quantity.toString()}>
              {variation.quantity + " " + formatUnit(unit, variation.quantity)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
