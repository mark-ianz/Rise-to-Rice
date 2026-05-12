import { Input } from "@/components/ui/input";
import { TableHead } from "@/components/ui/table";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function RewardHead({ search, setSearch }: Props) {
  const { t } = useTranslation("redeem_rewards");

  const [isSearching, setIsSearching] = useState(false);

  const handleCancelSearchClick = () => {
    setIsSearching(false);
    setSearch("");
  };

  return (
    <TableHead colSpan={2} className="flex items-center gap-2 justify-center w-full">
      {!isSearching ? (
        <div className="flex items-center gap-2">
          <p>{t("terms.reward")}</p>
          <span
            onClick={() => setIsSearching(true)}
            className="cursor-pointer p-1 rounded-full border border-transparent hover:border-tertiary hover:text-tertiary transition-all"
          >
            <Search size={14} />
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 max-w-[250px]">
          <Input
            type="search"
            placeholder={t("search_placeholder")}
            className="w-[250px] text-2xl shadow-none outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span
            onClick={handleCancelSearchClick}
            className="cursor-pointer p-1 rounded-full border border-transparent border-tertiary text-tertiary transition-all"
          >
            <X size={14} />
          </span>
        </div>
      )}
    </TableHead>
  );
}
