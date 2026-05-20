import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";

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
    { value: "latest", label: t("sort.latest"), icon: <Sparkles className="w-3.5 h-3.5" /> },
    { value: "oldest", label: t("sort.oldest"), icon: <Calendar className="w-3.5 h-3.5" /> },
    { value: "reactions", label: t("sort.reactions"), icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mr-1 hidden md:inline-block">
        Sort By:
      </span>
      <div className="flex items-center gap-1.5 bg-slate-100/60 p-1 rounded-xl border border-slate-200/50">
        {options.map((option) => {
          const isActive = currentSort === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleOrderChange(option.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-[#2D5A27] text-white border-[#2D5A27] shadow-sm"
                  : "bg-transparent text-slate-600 border-transparent hover:bg-slate-200/50 hover:text-slate-800"
              }`}
            >
              {option.icon}
              <span className="capitalize">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
