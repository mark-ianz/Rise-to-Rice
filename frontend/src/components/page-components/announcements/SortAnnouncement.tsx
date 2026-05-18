import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/lib/format";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

type TranslatedSort = {
  latest: string;
  oldest: string;
  reactions: string;
};

export default function SortAnnouncement() {
  const { t } = useTranslation("announcements");

  const sort = t("sort", {
    returnObjects: true,
  }) as TranslatedSort;

  const [order, setOrder] = useState<string>(t(sort.latest));
  const [searchParams, setSearchParams] = useSearchParams();

  const handleOrderChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    setOrder(value);
    newSearchParams.set("sort", value);
    setSearchParams(newSearchParams, { preventScrollReset: true });
    
  };

  return (
    <div>
      <Select onValueChange={handleOrderChange} value={order}>
        <SelectTrigger value={order} className="w-fit gap-2 bg-white">
          {order ? capitalizeFirstLetter(order) : "Sort by"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={t(sort.latest)}>
            {capitalizeFirstLetter(t(sort.latest))}
          </SelectItem>
          <SelectItem value={t(sort.oldest)}>
            {capitalizeFirstLetter(t(sort.oldest))}
          </SelectItem>
          <SelectItem value={t(sort.reactions)}>
            {capitalizeFirstLetter(t(sort.reactions))}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
