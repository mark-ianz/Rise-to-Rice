import HeaderText from "@/components/general/HeaderText";
import SelectDropDown from "@/components/page-components/view_profile/SelectDropDown";
import { chartFilterItems } from "@/lib/const/filter_items";
import { ChartType, ChartValueLabel } from "@/types/analytics";
import { TimeDisplay } from "@/types/time";
import { getDisplayChart } from "@/utils/analytics";
import { useEffect, useState } from "react";
import DashboardMaterialChart from "./DashboardMaterialChart";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useGetTopMatetial } from "@/hooks/query/useAnalytics";
import GenericError from "@/components/general/GenericError";
import PieChartSkeleton from "@/components/skeletons/analytics/PieChartSkeleton";

type Props = {
  time: TimeDisplay;
  className?: string;
  user_id?: number | null | undefined;
};

export default function MaterialsChart({ time, className, user_id }: Props) {
  const { t } = useTranslation("analytics");

  const {
    data: top_material,
    isLoading,
    refetch,
  } = useGetTopMatetial({
    user_id,
    time: time,
  });

  useEffect(() => {
    refetch();
  }, [time, refetch]);

  const [chartType, setChartType] = useState<ChartValueLabel>({
    value: "pie_chart",
    label: "Pie Chart",
  });

  if (isLoading) return <PieChartSkeleton />;

  if (!top_material)
    return (
      <div className="flex items-center justify-center">
        <GenericError />
      </div>
    );

  const handleOnValueChange = (value: string | number) => {
    setChartType({
      value: value as ChartType,
      label: getDisplayChart(value as ChartType),
    });
  };

  if (top_material.length === 0) return null;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex flex-col items-center gap-2">
        <HeaderText className="font-bold">{t("chart.title")}</HeaderText>
        {top_material.length > 0 && (
          <>
            <p className="text-sm text-tertiary">
              {t("chart.description", {
                time_period: time.label,
              })}
            </p>
            <SelectDropDown
              items={chartFilterItems}
              onValueChange={handleOnValueChange}
              value={chartType.value}
            >
              {chartType.label}
            </SelectDropDown>
          </>
        )}
      </div>
      <DashboardMaterialChart
        chartType={chartType}
        top_material={top_material}
      />
    </div>
  );
}
