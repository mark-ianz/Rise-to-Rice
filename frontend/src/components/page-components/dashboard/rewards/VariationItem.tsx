import { Input } from "@/components/ui/input";
import { RewardVariation } from "@/types/rewards";
import { useState } from "react";
import SaveVariationItem from "./SaveVariationItem";
import DeleteVariationItem from "./DeleteVariationItem";
import EditVariation from "./EditVariation";
import CancelEdit from "./CancelEdit";

type Props = {
  variation: RewardVariation;
  unit: string;
};

export default function VariationItem({ variation, unit }: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(variation.quantity);
  const [pointsCost, setPointsCost] = useState<number>(variation.points_cost);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(0);
    } else if (!isNaN(Number(value))) {
      setQuantity(Number(value));
    }
  };

  const handlePointsCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setPointsCost(0);
    } else if (!isNaN(Number(value))) {
      setPointsCost(Number(value));
    }
  };

  return (
    <li className="flex gap-2">
      <div className="flex gap-2">
        <span>
          <label className="text-sm max-sm:text-xs" htmlFor={"quantity" + variation.quantity}>
            Quantity{" "}
            <span className="text-xs text-tertiary">
              ({unit.toUpperCase()})
            </span>
          </label>
          <Input
            autoFocus
            disabled={!isEditing}
            name={"quantity" + variation.quantity}
            value={quantity}
            onChange={handleQuantityChange}
            type="number"
            className="max-md:text-sm max-sm:text-xs"
          />
        </span>
        <span>
          <label
            className="text-sm max-sm:text-xs"
            htmlFor={"points_cost" + variation.points_cost}
          >
            Poinst Cost
          </label>
          <Input
            disabled={!isEditing}
            name={"points_cost" + variation.points_cost}
            value={pointsCost}
            onChange={handlePointsCostChange}
            type="number"
            className="max-md:text-sm max-sm:text-xs"
          />
        </span>
      </div>
      <div className="flex items-end gap-2">
        {!isEditing ? (
          <>
            <EditVariation setIsEditing={setIsEditing} />
            <DeleteVariationItem id={variation.variation_id} />
          </>
        ) : (
          <>
            <SaveVariationItem
              setIsEditing={setIsEditing}
              info={{
                quantity,
                points_cost: pointsCost,
                id: variation.variation_id,
              }}
            />
            <CancelEdit setIsEditing={setIsEditing} />
          </>
        )}
      </div>
    </li>
  );
}
