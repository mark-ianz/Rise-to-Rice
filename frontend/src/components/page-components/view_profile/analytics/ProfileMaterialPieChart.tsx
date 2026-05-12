import { ChartConfig } from "@/components/ui/chart";
import { ChartData } from "@/types/analytics";
import MaterialPieChartLegends from "./MaterialPieChartLegends";
import MaterialPieChart from "./MaterialPieChart";

type Props = {
  chartData: ChartData;
  chartConfig: ChartConfig;
};

export default function ProfileMaterialPieChart({ chartData, chartConfig }: Props) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-[250px] ">
        <MaterialPieChart chartData={chartData} chartConfig={chartConfig} />
      </div>
      <div className="flex flex-col w-[350px] h-full p-5">
        <MaterialPieChartLegends chartData={chartData} />
      </div>
    </div>
  );
}
