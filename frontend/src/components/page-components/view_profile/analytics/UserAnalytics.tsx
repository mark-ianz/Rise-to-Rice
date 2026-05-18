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
    <div className="flex flex-col gap-4 py-6 px-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-main/10 flex items-center justify-center text-primary-main">
          {icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-4xl max-lg:text-3xl max-md:text-2xl font-light text-foreground tracking-tight">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-muted-foreground/60">{subtext}</p>
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
    <div className={cn("flex flex-col gap-10", className)}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-light text-foreground">
            {t("user_analytics.title")}
          </h2>
          <p className="text-xs text-muted-foreground/60">Track your sustainability impact</p>
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

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-sm:grid-cols-1 border-t border-border/40 pt-8">
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
