import { Gender } from "@/types/createAccount.type";
import { SelectValue } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function SelectGender({
  onChange,
  value,
  className,
  labelClassName,
  triggerClassName,
}: {
  onChange: (value: Gender) => void;
  value: Gender;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
}) {
  const { t } = useTranslation("form");
  const gender_list = t("gender_list", {
    returnObjects: true,
  }) as string[];

  return (
    <span className={cn("min-w-[150px] flex flex-col gap-1", className)}>
      <p className={cn("text-sm", labelClassName)}>{t("gender")}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("bg-white", triggerClassName)}>
          <SelectValue placeholder="Male" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">
            {capitalizeFirstLetter(gender_list[0])}
          </SelectItem>
          <SelectItem value="female">
            {capitalizeFirstLetter(gender_list[1])}
          </SelectItem>
          <SelectItem value="prefer not to say">
            {capitalizeFirstLetter(gender_list[2])}
          </SelectItem>
        </SelectContent>
      </Select>
    </span>
  );
}
