import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function SelectSuffix({
  onChange,
  value,
  className,
  labelClassName,
  triggerClassName,
}: {
  onChange: (value: string) => void;
  value: string;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
}) {
  const { t } = useTranslation("form");
  const suffix = ["None", "Jr.", "Sr.", "II", "III", "IV", "V"];

  return (
    <span className={cn("flex flex-col gap-1", className)}>
      <p className={cn("text-sm", labelClassName)}>{t("suffix")}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("bg-white", triggerClassName)}>
          <SelectValue placeholder={t("optional")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("suffixes")}</SelectLabel>
            {suffix.map((suffix, index) => (
              <SelectItem key={suffix + index} value={suffix}>
                {suffix}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </span>
  );
}
