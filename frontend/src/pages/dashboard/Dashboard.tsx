import HeaderText from "@/components/general/HeaderText";
import SelectDropDown from "@/components/page-components/view_profile/SelectDropDown";
import SectionWrapper from "@/components/general/SectionWrapper";
import { timeFilterItems } from "@/lib/const/filter_items";
import { queryKeys } from "@/lib/queryKeys";
import { Time, TimeDisplay } from "@/types/time";
import { getDisplayTime } from "@/utils/analytics";

import { lazy, Suspense, useState } from "react";
import DashboardCards from "../../components/page-components/dashboard/base/DashboardCards";
import { get_total_weight } from "@/services/analytics.service";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import LoadingComponent from "@/components/general/LoadingComponent";

const MaterialsChart = lazy(
  () => import("../../components/page-components/dashboard/base/MaterialsChart")
);
const DetailedMaterialAnalytics = lazy(
  () =>
    import(
      "../../components/page-components/dashboard/base/DetailedMaterialAnalytics"
    )
);

export default function Dashboard() {
  const [time, setTime] = useState<TimeDisplay>({
    value: "all_time",
    label: "All Time",
  });

  const { data: top_material } = useQuery({
    queryKey: queryKeys.topMaterial({
      time: time.value,
    }),
    queryFn: () => get_total_weight(time.value),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });

  if (!top_material) return null;

  const handleOnValueChange = (value: string) => {
    setTime({
      value: value as Time,
      label: getDisplayTime(value as Time),
    });
  };

  return (
    <SectionWrapper
      id="dashboard"
      className="items-start p-10 max-md:p-6 max-md:pt-4"
    >
      <Helmet>
        <title>Dashboard | Rise to Rice</title>
      </Helmet>

      <div className="flex flex-col gap-10 w-full max-lg:gap-6 max-md:gap-4">
        <div className="flex gap-4 items-center">
          <HeaderText>Dashboard</HeaderText>
          <SelectDropDown
            value={time.value}
            onValueChange={handleOnValueChange}
            items={timeFilterItems}
          >
            {time.label}
          </SelectDropDown>
        </div>
        <DashboardCards time={time} />
        <hr />
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <LoadingComponent className="size-8" />
            </div>
          }
        >
          <MaterialsChart time={time} />
          <DetailedMaterialAnalytics className="p-4" time={time} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
