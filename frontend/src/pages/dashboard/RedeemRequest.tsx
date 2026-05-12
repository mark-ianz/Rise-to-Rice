import SectionWrapper from "@/components/general/SectionWrapper";
import HeaderText from "@/components/general/HeaderText";
import SearchForm from "@/components/page-components/dashboard/SearchForm";
import { redeemRequestSearchForFilter } from "@/lib/const/filter_items";
import SearchRedeemRequestResult from "@/components/page-components/dashboard/redeem-request/SearchRedeemRequestResult";
import StatusCheckBoxFilter from "@/components/page-components/dashboard/redeem-request/StatusCheckBoxFilter";
import { Helmet } from "react-helmet";

export default function RedeemRequest() {
  return (
    <SectionWrapper
      id="redeem-request"
      className="flex-col items-start p-10 max-md:p-6 max-md:pt-4"
    >
      <Helmet>
        <title>Redeem Request | Rise to Rice</title>
      </Helmet>
      <div className="flex flex-col gap-6 w-full grow max-lg:gap-4">
        <HeaderText>Redeem Requests</HeaderText>
        <SearchForm searchForItems={redeemRequestSearchForFilter} />
        <StatusCheckBoxFilter />
        <SearchRedeemRequestResult />
      </div>
    </SectionWrapper>
  );
}
