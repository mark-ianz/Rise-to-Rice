import useUserContext from "@/hooks/useUserContext";
import UserAnalytics from "@/components/page-components/view_profile/analytics/UserAnalytics";
import { useState } from "react";
import { Time, TimeDisplay } from "@/types/time";
import { getDisplayTime } from "@/utils/analytics";
import MaterialsChart from "@/components/page-components/dashboard/base/MaterialsChart";
import DetailedMaterialAnalytics from "@/components/page-components/dashboard/base/DetailedMaterialAnalytics";

export default function Analytics({ user_id }: { user_id?: number }) {
  const { state } = useUserContext();
  const [time, setTime] = useState<TimeDisplay>({
    value: "all_time",
    label: "All-Time",
  });

  const user_id_to_use = user_id || state?.user_id;

  const onValueChange = (value: string | number) =>
    setTime({
      value: value as Time,
      label: getDisplayTime(value as Time),
    });


  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
        <UserAnalytics
          user_id={user_id_to_use}
          time={time}
          onSelectDropDownChange={onValueChange}
        />
        <DetailedMaterialAnalytics
          time={time}
          user_id={user_id_to_use}
        />
      </div>
      <MaterialsChart time={time} user_id={user_id_to_use}/>
    </div>
  );
}
