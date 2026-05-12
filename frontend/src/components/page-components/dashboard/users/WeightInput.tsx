import { Input } from "@/components/ui/input";
import useLogExchangeContext from "@/hooks/useLogExchangeContext";
import { calculatePoints, getUnit } from "@/lib/utils";
import { Unit } from "@/types/rewards";
import SelectUnit from "../SelectUnit";
import { material_units } from "@/lib/const";

export default function WeightInput() {
  const { state, dispatch } = useLogExchangeContext();

  return (
    <div className="flex flex-col">
      <p className="text-sm">Weight</p>
      <span className="flex gap-2">
        <Input
          onChange={(e) => {
            dispatch({ type: "SET_WEIGHT", payload: e.target.value });
            dispatch({
              type: "SET_POINTS",
              payload: Number(
                calculatePoints(
                  e.target.value,
                  state.unit,
                  state.selectedMaterial
                )
              ),
            });
          }}
          type="number"
          name="weight"
          disabled={!state.selectedMaterial.material}
          value={state.weight}
        />
        <SelectUnit
          units={material_units as Unit[]}
          value={state.unit.unit}
          onChange={(value: Unit) =>
            dispatch({
              type: "SET_UNIT",
              payload: getUnit(value),
            })
          }
        />
      </span>
    </div>
  );
}
