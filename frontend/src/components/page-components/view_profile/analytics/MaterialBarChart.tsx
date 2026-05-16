import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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

  // Sort data by weight for better visual presentation in bar chart
  const sortedData = [...chartData].sort((a, b) => b.weight - a.weight);

  // Calculate dynamic height based on number of items (45px per bar)
  const dynamicHeight = Math.max(300, sortedData.length * 45);

  return (
    <div 
      className="w-full mt-4 transition-all duration-300 overflow-visible" 
      style={{ height: `${dynamicHeight}px` }}
    >
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            left: 20, // Increased to prevent cutting off text
            right: 80, // Increased to give room for weight labels
            top: 10,
            bottom: 10
          }}
          barSize={24}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="material"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            width={140} // Increased for longer material names
            className="fill-secondary-dark/70 font-medium"
            tickFormatter={(value) =>
              value.length > 20 ? `${value.slice(0, 18)}...` : value
            }
          />
          <ChartTooltip 
            cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
            content={<ChartTooltipContent hideIndicator />} 
          />
          <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
            <LabelList
              position="right"
              offset={10}
              className="fill-secondary-dark font-bold whitespace-nowrap"
              fontSize={12}
              // Using non-breaking space to prevent wrapping
              formatter={(value: number) => `${value}\u00A0kg`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
