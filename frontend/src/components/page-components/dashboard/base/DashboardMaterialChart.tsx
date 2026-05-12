import MaterialPieChart from "@/components/page-components/view_profile/analytics/MaterialPieChart";
import PieChartLegends from "@/components/page-components/view_profile/analytics/MaterialPieChartLegends";
import MaterialBarChart from "@/components/page-components/view_profile/analytics/MaterialBarChart";
import { ChartValueLabel, MaterialAnalytics } from "@/types/analytics";
import { getMaterialChartConfig, getMaterialChartData } from "@/lib/utils";

type Props = {
  chartType: ChartValueLabel;
  top_material: MaterialAnalytics[];
};

export default function DashboardMaterialChart({
  chartType,
  top_material,
}: Props) {
  const chartData = getMaterialChartData(top_material);
  const chartConfig = getMaterialChartConfig(top_material);

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center">
      <div className="w-full max-w-[500px] max-lg:max-w-[350px]">
        {chartType.value === "pie_chart" && (
          <MaterialPieChart chartData={chartData} chartConfig={chartConfig} />
        )}
        {chartType.value === "bar_chart" && (
          <MaterialBarChart chartData={chartData} chartConfig={chartConfig} />
        )}
      </div>
      <PieChartLegends className="gap-x-4" chartData={chartData} />
    </div>
  );
}
