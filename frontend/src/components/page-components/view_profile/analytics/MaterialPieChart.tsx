import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "@/types/analytics";
import { Pie, PieChart } from "recharts";

type Props = {
  chartData: ChartData;
  chartConfig: ChartConfig;
};

export default function MaterialPieChart({ chartData, chartConfig }: Props) {
  if (chartData.length === 0) {
    return (
      <span className="h-40 flex items-center justify-center">
        <p className="text-center text-sm text-tertiary">No data Available</p>
      </span>
    );
  }
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="weight"
          nameKey="material"
          innerRadius="55%"
          outerRadius="90%"
          strokeWidth={2}
          stroke="hsl(var(--background))"
        />
      </PieChart>
    </ChartContainer>
  );
}
