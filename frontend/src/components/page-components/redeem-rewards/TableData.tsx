import { TableCell } from "@/components/ui/table";
import { useState } from "react";
import Quantity from "./Quantity";
import RedeemButton from "./RedeemButton";
import { Reward } from "@/types/rewards";

type Props = {
  reward: Reward;
};

export default function TableData({ reward }: Props) {
  const [points_cost, setPointsCost] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [variationId, setRewardVariationId] = useState<number>(0);

  return (
    <>
      <TableCell>{reward.reward_name}</TableCell>
      <Quantity
        setRewardVariationId={setRewardVariationId}
        setSelectedQuantity={setSelectedQuantity}
        selectedQuantity={selectedQuantity}
        reward_id={reward.reward_id}
        unit={reward.unit}
        setPointsCost={setPointsCost}
      />
      <TableCell className="text-center">{points_cost}</TableCell>
      <RedeemButton
        variationId={variationId}
        reward={reward}
        points_cost={points_cost}
        selectedQuantity={selectedQuantity}
      />
    </>
  );
}
