import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function SortAnnouncement() {
  const { t } = useTranslation("announcements");
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSort = searchParams.get("sort") || "latest";

  const handleOrderChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === "latest") {
      newSearchParams.delete("sort");
    } else {
      newSearchParams.set("sort", value);
    }
    setSearchParams(newSearchParams, { preventScrollReset: true });
  };

  const options = [
    { value: "latest", label: t("sort.latest") },
    { value: "oldest", label: t("sort.oldest") },
    { value: "reactions", label: t("sort.reactions") },
  ];

  return (
    <div className="flex items-center gap-1 shrink-0">
      <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline-block">
        Sort:
      </span>
      <div className="flex items-center gap-0.5 bg-slate-100/70 p-0.5 rounded-lg">
        {options.map((option) => {
          const isActive = currentSort === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleOrderChange(option.value)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all duration-200 active:scale-95 ${isActive
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <span className="capitalize">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
