import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useSearchParams } from "react-router-dom";

type Props = {
  filters: { id: string; label: string }[];
  name: string;
};

export default function CheckBoxFilter({ filters, name }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  // get the array of name
  const currentParamsArray = searchParams.getAll(name);

  const handleOnChange = (checked: CheckedState, filter_id: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const prevStatus = searchParams.getAll(name) || "";

    if (!checked) {
      const filtered = prevStatus.filter((status) => status !== filter_id);

      newSearchParams.delete(name);

      filtered.forEach((status) => newSearchParams.append(name, status));
    } else {
      newSearchParams.append(name, filter_id);
    }

    setSearchParams(newSearchParams);
  };

  return (
    <div className="flex gap-2 text-tertiary flex-wrap">
      {filters.map((filter, index) => (
        <span key={filter.id + index} className="flex gap-1">
          <Checkbox
            onCheckedChange={(checked) => handleOnChange(checked, filter.id)}
            id={filter.id}
            // initialize the checkbox as checked if it's in the current params
            checked={currentParamsArray.includes(filter.id)}
            className="border-tertiary data-[state=checked]:bg-primary-main data-[state=checked]:text-secondary-light"
          />
          <Label htmlFor={filter.id} className="mr-2 max-lg:text-xs cursor-pointer">
            {filter.label}
          </Label>
        </span>
      ))}
    </div>
  );
}
