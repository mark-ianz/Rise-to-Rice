import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Unit } from "@/types/rewards";

type Props = {
  value: Unit;
  onChange: (value: Unit) => void;
  name?: string;
  className?: string;
  units: Unit[];
};

export default function SelectUnit({
  value,
  onChange,
  name,
  className,
  units,
}: Props) {
  return (
    <Select value={value} onValueChange={onChange} name={name || "select-unit"}>
      <SelectTrigger className={cn("w-fit gap-2", className)}>
        {value}
      </SelectTrigger>
      <SelectContent>
        {units.map((unit, index) => (
          <SelectItem key={unit + index} value={unit}>
            {unit.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
