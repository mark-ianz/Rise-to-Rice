import HeaderText from "@/components/general/HeaderText";
import AddReward from "@/components/page-components/dashboard/rewards/AddReward";
import SearchRewardResult from "@/components/page-components/dashboard/rewards/SearchRewardResult";
import SearchForm from "@/components/page-components/dashboard/SearchForm";
import SectionWrapper from "@/components/general/SectionWrapper";
import { rewardsSearchForFilter } from "@/lib/const/filter_items";
import { Helmet } from "react-helmet-async";

export default function Rewards() {
  return (
    <SectionWrapper
      id="rewards"
      className="flex-col items-start p-10 max-md:p-6 max-md:pt-4"
    >
      <Helmet>
        <title>Rewards | Rise to Rice</title>
      </Helmet>
      <div className="flex flex-col gap-6 w-full grow max-lg:gap-4">
        <span className="flex gap-2 items-center">
          <HeaderText>Rewards</HeaderText>
          <AddReward />
        </span>
        <SearchForm searchForItems={rewardsSearchForFilter} />
        <SearchRewardResult />
      </div>
    </SectionWrapper>
  );
}
