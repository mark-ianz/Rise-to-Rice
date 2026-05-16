import { cn } from "@/lib/utils";
import { ChartData } from "@/types/analytics";

type Props = {
  chartData: ChartData;
  className?: string;
};

export default function PieChartLegends({ chartData, className }: Props) {
  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2", className)}>
      {chartData.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: item.fill }}
          />
          <span className="text-xs text-secondary-dark/70 whitespace-nowrap">{item.material}</span>
        </div>
      ))}
    </div>
  );
}
