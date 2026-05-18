import { TimeDisplay } from "@/types/time";
import { getMaterialTotalWeight } from "@/utils/analytics";
import SelectDropDown from "../SelectDropDown";
import { timeFilterItems } from "@/lib/const/filter_items";
import { cn } from "@/lib/utils";
import {
  useGetTopMatetial,
  useGetUserAnalytics,
} from "@/hooks/query/useAnalytics";
import { useTranslation } from "react-i18next";
import SideKeyValuePairSkeleton from "@/components/skeletons/profile/SideKeyValuePairSkeleton";
import GenericError from "@/components/general/GenericError";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import {
  Scale,
  Trophy,
  Weight,
  RefreshCw,
  Coins,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

type AnalyticsProps = {
  user_id?: number | null | undefined;
  time: TimeDisplay;
  onSelectDropDownChange: (value: string | number) => void;
  className?: string;
};

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white dark:bg-card rounded-xl p-5 border border-border/50 shadow-md hover:shadow-lg hover:border-primary-main/30 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary-main/20 to-primary-main/10 flex items-center justify-center text-primary-main group-hover:from-primary-main/30 group-hover:to-primary-main/15 transition-colors duration-300">
            {icon}
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">
            {label}
          </span>
        </div>
        <p className="text-3xl max-lg:text-2xl max-md:text-xl font-bold text-foreground tracking-tight truncate mb-1">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-muted-foreground/70 truncate">{subtext}</p>
        )}
      </div>
    </div>
  );
}

export default function UserAnalytics({
  user_id,
  time,
  onSelectDropDownChange,
  className,
}: AnalyticsProps) {
  const { t } = useTranslation("analytics");

  const { data: top_material, isLoading: top_material_isLoading } =
    useGetTopMatetial({
      user_id: user_id,
      time: time,
    });

  const { data: user_analytics, isLoading: user_analytics_isLoading } =
    useGetUserAnalytics({
      user_id: user_id,
      time: time,
    });

  if (top_material_isLoading || user_analytics_isLoading)
    return <SideKeyValuePairSkeleton />;

  if (!top_material || !user_analytics) return <GenericError />;

  const totalWeight = Number(
    getMaterialTotalWeight(top_material)
  ).toLocaleString();
  const totalTimesExchanged = user_analytics?.total_exchange_count;
  const points_accumulated = formatNumberWithCommasAndDecimals(
    user_analytics?.total_points
  );
  const top_material_weight = formatNumberWithCommasAndDecimals(
    top_material[0]?.total_weight
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-main/10 text-primary-main rounded-lg">
            <TrendingUp size={18} className="" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {t("user_analytics.title")}
            </h2>
            <p className="text-xs text-muted-foreground/60 mt-0.5">Your performance metrics</p>
          </div>
        </div>
        <SelectDropDown
          onValueChange={onSelectDropDownChange}
          value={time.value}
          items={timeFilterItems}
          className="h-9 py-0 text-xs px-3 rounded-lg"
        >
          {time.label}
        </SelectDropDown>
      </div>

      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        <StatCard
          icon={<Scale size={18} className="text-primary-main" />}
          label={t("user_analytics.wastes_exchanged")}
          value={`${totalWeight} kg`}
          subtext="Total recycled"
        />
        <StatCard
          icon={<Trophy size={18} className="text-primary-main" />}
          label={t("user_analytics.top_material")}
          value={top_material[0]?.material || "N/A"}
          subtext="Most frequent"
        />
        <StatCard
          icon={<Weight size={18} className="text-primary-main" />}
          label={t("user_analytics.top_material_weight")}
          value={`${top_material_weight} kg`}
          subtext="Heaviest item"
        />
        <StatCard
          icon={<RefreshCw size={18} className="text-primary-main" />}
          label={t("user_analytics.times_exchanged")}
          value={totalTimesExchanged.toString()}
          subtext={t("user_analytics.times_exchanged_amount", {
            count: totalTimesExchanged || 0,
          })}
        />
        <div className="col-span-2 max-sm:col-span-1">
          <StatCard
            icon={<Coins size={18} className="text-primary-main" />}
            label={t("user_analytics.points_accumulated")}
            value={points_accumulated}
            subtext="Total rewards"
          />
        </div>
      </div>
    </div>
  );
}
