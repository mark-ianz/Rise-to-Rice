import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  children: string;
  items: { value: string; label: string }[];
  name?: string;
  className?: string;
};

export default function SelectDropDown({
  value,
  onValueChange,
  children,
  items,
  name,
  className,
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange} name={name}>
      <SelectTrigger className={cn("bg-white w-fit", className)}>
        <p className="text-primary-main text-sm max-lg:text-xs">{children}</p>
      </SelectTrigger>
      <SelectContent className="overflow-visible">
        {items.map((item, index) => (
          <SelectItem key={item.value + index} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
