import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import useLogExchangeContext from "@/hooks/useLogExchangeContext";
import { useEffect } from "react";

export default function MaterialSelect() {
  const { state, dispatch } = useLogExchangeContext();

  // this useEffect is used to set the selected material to the first material in the list
  useEffect(() => {
    if (state.selectedCategory.types.length > 0) {
      dispatch({
        type: "SET_SELECTED_MATERIAL",
        payload: state.selectedCategory.types[0],
      });
    }
  }, [dispatch, state.selectedCategory.types]);

  const handleSelectOnChange = (value: string) => {
    // find the material that matches the value
    const material = state.selectedCategory.types.find(
      (material) => material.material_id.toString() === value
    );

    if (!material) return;

    dispatch({ type: "SET_SELECTED_MATERIAL", payload: material });
  };

  return (
    <span>
      <p className="text-sm">Type of Material</p>
      <Select onValueChange={handleSelectOnChange}>
        <SelectTrigger>{state.selectedMaterial.material}</SelectTrigger>
        <SelectContent>
          {state.selectedCategory.types.map((material) => (
            <SelectItem
              key={material.material_id}
              value={material.material_id.toString()}
            >
              {material.material}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </span>
  );
}
