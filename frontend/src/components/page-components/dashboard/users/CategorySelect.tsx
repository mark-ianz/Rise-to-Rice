import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useGetCategories } from "@/hooks/query/useMaterial";
import useLogExchangeContext from "@/hooks/useLogExchangeContext";

export default function CategorySelect() {
  const { state, dispatch } = useLogExchangeContext();

  const { data: categories } = useGetCategories();

  const handleSelectOnChange = (value: string) => {
    // find the material that matches the value
    const material = categories?.find(
      (category) => category?.category_id.toString() === value
    );

    if (!material) return;

    dispatch({ type: "SET_SELECTED_CATEGORY", payload: material });
  };

  return (
    <span>
      <p className="text-sm">Category</p>
      <Select onValueChange={handleSelectOnChange}>
        <SelectTrigger>{state.selectedCategory.category}</SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem
              key={category.category_id}
              value={category.category_id.toString()}
            >
              {category.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </span>
  );
}
