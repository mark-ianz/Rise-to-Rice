import HeaderText from "@/components/general/HeaderText";
import StatusCheckBoxFilter from "@/components/page-components/dashboard/redeem-request/StatusCheckBoxFilter";
import SearchPagination from "@/components/page-components/dashboard/SearchPagination";
import RedeemHistoryCard from "@/components/page-components/redeem-history/RedeemHistoryCard";
import SectionWrapper from "@/components/general/SectionWrapper";
import useUserContext from "@/hooks/useUserContext";
import { Link, useSearchParams } from "react-router-dom";
import { useGetRedeemHistory } from "@/hooks/query/useRedeemRequest";
import GenericError from "@/components/general/GenericError";
import RedeemHistoryCardSkeleton from "@/components/skeletons/RedeemHistoryCardSkeleton";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function RedeemHistory() {
  const { state } = useUserContext();
  const [searchParams, _] = useSearchParams();
  const { t } = useTranslation("redeem_rewards");

  const status = searchParams.getAll("status");
  const page = Number(searchParams.get("page")) || 1;

  const {
    data: user_redeem_request,
    isLoading,
    isError,
    refetch,
  } = useGetRedeemHistory({
    status,
    page,
    endpoint: `/api/redeem-request/user/${state.user_id}`,
  });

  // refetch the data when the status changes
  useEffect(() => {
    refetch();
  }, [status, page, refetch]);

  if ((!user_redeem_request || isError) && !isLoading) return <GenericError />;

  const isEmpty = user_redeem_request?.result.length === 0;

  return (
    <SectionWrapper
      id="redeem-history"
      className="px-20 items-start py-10 justify-center max-md:px-10 max-sm:px-6"
    >
      <Helmet>
        <title>Redeem History | Rise to Rice</title>
        <meta
          name="description"
          content="View your previous reward redemptions and see what you’ve earned on Rise to Rice."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://risetorice.com/redeem-history" />

        <meta property="og:title" content="Redeem History — Rise to Rice" />
        <meta
          property="og:description"
          content="Keep track of your previous redemptions and contributions to a cleaner community."
        />
        <meta
          property="og:url"
          content="https://risetorice.com/redeem-history"
        />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>

      <div className="max-w-screen-lg w-full">
        <HeaderText className="mb-2">{t("redeem_history.title")}</HeaderText>
        <StatusCheckBoxFilter />
        <ol className="grid grid-cols-3 gap-4 my-4 max-md:grid-cols-2 max-xsm:grid-cols-1">
          {isLoading && <RedeemHistoryCardSkeleton length={12} />}
          {user_redeem_request?.result.map((request) => (
            <RedeemHistoryCard
              key={request.redeem_request_id}
              request={request}
            />
          ))}
          {isEmpty && (
            <div className="col-span-3 text-center text-muted-foreground max-lg:text-sm">
              <p>{t("redeem_history.empty.title")}</p>
              <Link to={"/redeem-rewards"} className="underline text-tertiary">
                {t("redeem_history.empty.link")}
              </Link>
            </div>
          )}
        </ol>
        {!isEmpty && (
          <SearchPagination
            hasNext={user_redeem_request?.hasNext}
            hasPrev={user_redeem_request?.hasPrev}
          />
        )}
      </div>
    </SectionWrapper>
  );
}
