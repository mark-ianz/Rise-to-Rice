import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

type Props = {
  chartData: {
    material: string;
    weight: number;
    weight_percentage: number;
    fill: string;
  }[];
  chartConfig: ChartConfig;
};

export default function MaterialBarChart({ chartData, chartConfig }: Props) {
  if (chartData.length === 0) {
    return (
      <span className="h-40 flex items-center justify-center">
        <p className="text-center text-sm text-tertiary">No data Available</p>
      </span>
    );
  }
  return (
    <div className="w-full max-w-[600px] pt-10">
      <ChartContainer config={chartConfig}>
        <BarChart
          maxBarSize={100}
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="material"
            tickLine={false}
            tickMargin={4}
            axisLine={false}
            tickFormatter={(value) =>
              value.length > 10 ? `${value.slice(0, 10)}...` : value
            }
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="weight" fill="var(--color-desktop)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={11}
              formatter={(value: number) => `${value} kg`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
