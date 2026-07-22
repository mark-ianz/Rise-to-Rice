import SectionWrapper from "@/components/general/SectionWrapper";
import WelcomeHeader from "@/components/page-components/user-home/WelcomeHeader";
import PointsRewardsCard from "@/components/page-components/user-home/PointsRewardsCard";
import ImpactStats from "@/components/page-components/user-home/ImpactStats";
import DetailedMaterialAnalytics from "@/components/page-components/dashboard/base/DetailedMaterialAnalytics";
import MaterialsChart from "@/components/page-components/dashboard/base/MaterialsChart";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Time, TimeDisplay } from "@/types/time";
import { getDisplayTime } from "@/utils/analytics";
import useUserContext from "@/hooks/useUserContext";

export default function UserHome() {
  const { t } = useTranslation("user_home");
  const { state } = useUserContext();
  const [time, setTime] = useState<TimeDisplay>({
    value: "all_time",
    label: t("all_time"),
  });

  const onValueChange = (value: string | number) =>
    setTime({
      value: value as Time,
      label: getDisplayTime(value as Time),
    });

  return (
    <SectionWrapper
      id="user-home"
      screen={false}
      className="justify-center py-10 px-20 max-md:px-10 max-sm:px-6"
    >
      <Helmet>
        <title>{t("meta_title")}</title>
        <meta
          name="description"
          content={t("meta_description")}
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://risetorice.com/home" />
      </Helmet>

      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-6 pb-10">
        {/* Welcome Section */}
        <WelcomeHeader />

        {/* Points Balance + Impact Stats — combined row */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          {/* Points & Recent Activity — takes 1 col */}
          <div className="col-span-1">
            <PointsRewardsCard />
          </div>

          {/* Impact Stats — takes 2 cols, contains title + filter */}
          <div className="col-span-2 max-lg:col-span-1">
            <ImpactStats time={time} onTimeChange={onValueChange} />
          </div>
        </div>

        {/* Detailed Material Analytics — full width */}
        <DetailedMaterialAnalytics time={time} user_id={state?.user_id} />

        {/* Top Materials Chart — full width */}
        <MaterialsChart time={time} user_id={state?.user_id} />
      </div>
    </SectionWrapper>
  );
}
