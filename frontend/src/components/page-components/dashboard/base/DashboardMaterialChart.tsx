import MaterialPieChart from "@/components/page-components/view_profile/analytics/MaterialPieChart";
import PieChartLegends from "@/components/page-components/view_profile/analytics/MaterialPieChartLegends";
import MaterialBarChart from "@/components/page-components/view_profile/analytics/MaterialBarChart";
import { ChartValueLabel, MaterialAnalytics } from "@/types/analytics";
import { getMaterialChartConfig, getMaterialChartData } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  chartType: ChartValueLabel;
  top_material: MaterialAnalytics[];
  showAll?: boolean;
};

export default function DashboardMaterialChart({
  chartType,
  top_material,
  showAll = false,
}: Props) {
  // Process data based on whether user wants to see everything or a simplified view
  const processedData = useMemo(() => {
    const rawData = getMaterialChartData(top_material);
    
    // If showAll is true, return every item
    if (showAll || rawData.length <= 6) return rawData;

    const threshold = 3; // 3% threshold for "Others"
    const mainItems = rawData.filter(item => item.weight_percentage >= threshold);
    const otherItems = rawData.filter(item => item.weight_percentage < threshold);

    if (otherItems.length === 0) return rawData;

    const othersWeight = otherItems.reduce((acc, curr) => acc + curr.weight, 0);
    const othersPercentage = otherItems.reduce((acc, curr) => acc + curr.weight_percentage, 0);

    return [
      ...mainItems,
      {
        material: "Others",
        weight: othersWeight,
        weight_percentage: othersPercentage,
        fill: "#94a3b8", // Slate-400 for others
      }
    ];
  }, [top_material, showAll]);

  const chartConfig = getMaterialChartConfig(top_material);

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <div className="w-full flex flex-col items-center">
        {chartType.value === "pie_chart" ? (
          <div className="w-full max-w-[400px]">
            <MaterialPieChart chartData={processedData} chartConfig={chartConfig} showAll={showAll} />
          </div>
        ) : (
          <MaterialBarChart chartData={processedData} chartConfig={chartConfig} />
        )}
      </div>
      <PieChartLegends className="max-w-[800px] gap-x-6 gap-y-3" chartData={processedData} />
    </div>
  );
}
