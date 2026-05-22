import { ChartType, ChartValueLabel } from "@/types/analytics";
import { TimeDisplay } from "@/types/time";
import { useEffect, useState } from "react";
import DashboardMaterialChart from "./DashboardMaterialChart";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useGetTopMatetial } from "@/hooks/query/useAnalytics";
import GenericError from "@/components/general/GenericError";
import PieChartSkeleton from "@/components/skeletons/analytics/PieChartSkeleton";
import EnvironmentalImpact from "./EnvironmentalImpact";

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

  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <PieChartSkeleton />;

  if (!top_material)
    return (
      <div className="flex items-center justify-center">
        <GenericError />
      </div>
    );

  if (top_material.length === 0) return null;

  const isPie = chartType.value === "pie_chart";

  return (
    <div className={cn("grid grid-cols-5 gap-6 max-xl:grid-cols-1", className)}>
      {/* Chart Section - Takes 3 columns */}
      <div className="col-span-3 max-xl:col-span-1 bg-white rounded-2xl p-6 max-md:p-4 border border-warm-tan/15 shadow-sm">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-xl max-md:text-lg font-bold text-secondary-dark tracking-tight">
              Material Distribution
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-secondary-dark/50">
                A visual overview of your recycling mix.
              </p>
              <button 
                onClick={() => setShowAll(!showAll)}
                className={cn(
                  "text-[11px] font-bold px-2 py-0.5 rounded-full transition-all border",
                  showAll 
                    ? "bg-primary-main/10 border-primary-main/20 text-primary-main" 
                    : "bg-warm-cream/50 border-warm-tan/20 text-secondary-dark/40 hover:text-secondary-dark/60"
                )}
              >
                {showAll ? "Show Simplified" : "Show All Details"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-warm-cream/50 p-1 rounded-full border border-warm-tan/10">
            <button
              onClick={() => setChartType({ value: "pie_chart" as ChartType, label: "Pie Chart" })}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
                isPie ? "bg-primary-main text-white shadow-md" : "text-secondary-dark/50 hover:text-secondary-dark"
              )}
            >
              Donut
            </button>
            <button
              onClick={() => setChartType({ value: "bar_chart" as ChartType, label: "Bar Chart" })}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
                !isPie ? "bg-primary-main text-white shadow-md" : "text-secondary-dark/50 hover:text-secondary-dark"
              )}
            >
              Bars
            </button>
          </div>
        </div>

        <DashboardMaterialChart
          chartType={chartType}
          top_material={top_material}
          showAll={showAll}
        />
      </div>

      {/* Environmental Impact Section - Takes 2 columns */}
      <div className="col-span-2 max-xl:col-span-1">
        <EnvironmentalImpact data={top_material} />
      </div>
    </div>
  );
}
