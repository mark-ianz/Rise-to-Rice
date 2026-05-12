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
}: {
  onChange: (value: string) => void;
  value: string;
  className?: string;
}) {
  const { t } = useTranslation("form");
  const suffix = ["None", "Jr.", "Sr.", "II", "III", "IV", "V"];

  return (
    <span className={cn("flex flex-col gap-1", className)}>
      <p className="text-sm">{t("suffix")}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white">
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
