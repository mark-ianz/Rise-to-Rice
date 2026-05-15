import SectionWrapper from "@/components/general/SectionWrapper";
import WelcomeHeader from "@/components/page-components/user-home/WelcomeHeader";
import PointsRewardsCard from "@/components/page-components/user-home/PointsRewardsCard";
import ImpactStats from "@/components/page-components/user-home/ImpactStats";
import Analytics from "@/components/page-components/view_profile/analytics/Analytics";
import { Helmet } from "react-helmet";

export default function UserHome() {
  return (
    <SectionWrapper
      id="user-home"
      screen={false}
      className="justify-center py-10 px-20 max-md:px-10 max-sm:px-6"
    >
      <Helmet>
        <title>Home | Rise to Rice</title>
        <meta
          name="description"
          content="Your personal Rise to Rice dashboard. Track your recycling impact, manage rewards, and stay updated."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://risetorice.com/home" />
      </Helmet>

      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-8 pb-10">
        {/* Welcome Section */}
        <WelcomeHeader />

        {/* Points + Impact Summary Row */}
        <div className="grid grid-cols-5 gap-6 max-lg:grid-cols-1">
          {/* Points & Rewards — takes 2 cols */}
          <div className="col-span-2 max-lg:col-span-1">
            <PointsRewardsCard />
          </div>

          {/* Impact Stats — takes 3 cols */}
          <div className="col-span-3 max-lg:col-span-1 flex flex-col">
            <ImpactStats />
          </div>
        </div>

        {/* Full Analytics — charts & detailed breakdown */}
        <Analytics />
      </div>
    </SectionWrapper>
  );
}
