import { TimeDisplay } from "@/types/time";
import { getMaterialTotalWeight } from "@/utils/analytics";
import KeyValuePair from "./KeyValuePair";
import HeaderText from "../../../general/HeaderText";
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

type AnalyticsProps = {
  user_id?: number | null | undefined;
  time: TimeDisplay;
  onSelectDropDownChange: (value: string | number) => void;
  className?: string;
};

export default function UserAnalytics({
  user_id,
  time,
  onSelectDropDownChange,
  className,
}: AnalyticsProps) {
  // if id is not provided, it means the user is viewing their own analytics
  // if id is provided, it means the user (admin) is viewing another user's analytics

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
    <div className={cn("flex flex-col grow gap-4 max-lg:text-sm", className)}>
      <span className="flex gap-4 items-center">
        <HeaderText className="font-bold">
          {t("user_analytics.title")}
        </HeaderText>
        <SelectDropDown
          onValueChange={onSelectDropDownChange}
          value={time.value}
          items={timeFilterItems}
        >
          {time.label}
        </SelectDropDown>
      </span>
      <div className="flex-1 flex flex-col gap-4">
        <KeyValuePair
          head={t("user_analytics.wastes_exchanged")}
          value={`${totalWeight} kg`}
        />
        <KeyValuePair
          head={t("user_analytics.top_material")}
          value={top_material[0]?.material || "N/A"}
        />
        <KeyValuePair
          head={t("user_analytics.top_material_weight")}
          value={`${top_material_weight} kg`}
        />
        <KeyValuePair
          head={t("user_analytics.times_exchanged")}
          value={t("user_analytics.times_exchanged_amount", {
            count: totalTimesExchanged || 0,
          })}
        />
        <KeyValuePair
          head={t("user_analytics.points_accumulated")}
          value={points_accumulated}
        />
      </div>
    </div>
  );
}
