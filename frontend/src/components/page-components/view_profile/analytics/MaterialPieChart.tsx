import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "@/types/analytics";
import { Label, Pie, PieChart } from "recharts";
import { useMemo } from "react";

type Props = {
  chartData: ChartData;
  chartConfig: ChartConfig;
  showAll?: boolean;
};

export default function MaterialPieChart({ chartData, chartConfig, showAll }: Props) {
  const totalWeight = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.weight, 0);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <span className="h-40 flex items-center justify-center">
        <p className="text-center text-sm text-tertiary">No data Available</p>
      </span>
    );
  }

  // If there are many segments (Show All), we reduce padding and increase minAngle
  // to ensure tiny segments are visible and clickable.
  const isCrowded = chartData.length > 8;

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="weight"
          nameKey="material"
          innerRadius="65%"
          outerRadius="90%"
          strokeWidth={isCrowded ? 2 : 5}
          stroke="hsl(var(--background))"
          paddingAngle={isCrowded ? 1 : 2}
          minAngle={isCrowded ? 12 : 0}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-secondary-dark text-3xl max-md:text-2xl font-bold"
                    >
                      {totalWeight.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-secondary-dark/50 text-xs font-semibold uppercase tracking-wider"
                    >
                      Total KG
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
