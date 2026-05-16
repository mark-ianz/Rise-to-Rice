import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { TimeDisplay } from "@/types/time";
import MaterialPieChart from "@/components/page-components/view_profile/analytics/ProfileMaterialPieChart";
import HeaderText from "@/components/general/HeaderText";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { get_total_weight } from "@/services/analytics.service";
import SelectDropDown from "../SelectDropDown";
import { useState } from "react";
import { getDisplayChart } from "@/utils/analytics";
import { ChartType, ChartValueLabel } from "@/types/analytics";
import ProfileMaterialBarChart from "./MaterialBarChart";
import { getMaterialChartConfig, getMaterialChartData } from "@/lib/utils";
import { chartFilterItems } from "@/lib/const/filter_items";

type TopMaterialChartProps = {
  user_id?: number | null | undefined;
  time: TimeDisplay;
};

export function TopMaterialsChart({ user_id, time }: TopMaterialChartProps) {
  const [chartType, setChartType] = useState<ChartValueLabel>({
    value: "pie_chart",
    label: "Pie Chart",
  });

  const { data: top_material } = useQuery({
    queryKey: queryKeys.topMaterial({
      userId: user_id,
      time: time.value,
    }),
    queryFn: () => get_total_weight(time.value, user_id),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });

  if (!top_material) return null;

  const chartData = getMaterialChartData(top_material);
  const chartConfig = getMaterialChartConfig(top_material);

  const onSelectDropDownChange = (value: string) => {
    setChartType({
      value: value as ChartType,
      label: getDisplayChart(value as ChartType),
    });
  };

  return (
    "<div className="grow flex flex - col gap - 4">
      < div className = "flex gap-4 items-center justify-center" >
        <HeaderText className="font-bold">Top Materials Chart</HeaderText>
  {
    top_material.length > 0 && (
      <SelectDropDown
        onValueChange={onSelectDropDownChange}
        items={chartFilterItems}
        value={chartType.label}
      >
        {chartType.label}
      </SelectDropDown>
    )
  }
      </div >
  {
    top_material.length > 0 ? (
      <Card className="flex bg-transparent shadow-none border-none p-0">
        <CardContent className="flex-1 pb-0 flex flex-col items-cente">
          <CardHeader className="items-center p-0">
            <CardDescription className="text-sm">
              Total Weight by Material ({time.label})
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col justify-center items-center w-full gap-20">
            {chartType.value === "pie_chart" && (
              <MaterialPieChart
                chartData={chartData}
                chartConfig={chartConfig}
              />
            )}
            {chartType.value === "bar_chart" && (
              <ProfileMaterialBarChart
                chartData={chartData}
                chartConfig={chartConfig}
              />
            )}
          </div>
        </CardContent>
      </Card>
    ) : (
      <p className="text-center">No data available</p>
    )
  }
    </div > "
  );
}
