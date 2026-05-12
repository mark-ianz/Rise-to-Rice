import { cn } from "@/lib/utils";
import { ChartData } from "@/types/analytics";
import { useTranslation } from "react-i18next";

type Props = {
  chartData: ChartData;
  className?: string;
};

export default function PieChartLegends({ chartData, className }: Props) {
  const { t } = useTranslation("analytics");

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-semibold max-lg:text-sm">{t("chart.legends")}</p>
      <ol className={cn("grid", className, chartData.length > 3 ? "grid-cols-2" : "grid-cols-1", "max-xsm:grid-cols-1")}>
        {chartData.map((item, index) => (
          <li key={index} className="flex items-center gap-2 min-w-fit">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <p className="text-sm">{item.material}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
