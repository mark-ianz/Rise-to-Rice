import HeaderText from "@/components/general/HeaderText";
import RewardsTable from "@/components/page-components/redeem-rewards/RewardsTable";
import Points from "@/components/general/Points";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function RedeemRewards() {
  const { t } = useTranslation("redeem_rewards");

  return (
    <SectionWrapper
      id="redeem-rewards"
      className="px-20 items-start py-10 pb-20 justify-center max-md:px-10 max-sm:px-6"
    >
      <Helmet>
        <title>Redeem Rewards | Rise to Rice</title>
        <meta
          name="description"
          content="Exchange your points with corresponding rewards with Rise to Rice. You can choose from a variety of options available in our rewards list."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://risetorice.com/redeem-rewards" />

        <meta property="og:title" content="Redeem Rewards — Rise to Rice" />
        <meta
          property="og:description"
          content="Claim your well-earned rewards and support your family with every eco-friendly step."
        />
        <meta
          property="og:url"
          content="https://risetorice.com/redeem-rewards"
        />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>

      <div className="flex flex-col justify-center gap-4 max-w-screen-md">
        <span className="flex flex-col">
          <HeaderText>{t("title")}</HeaderText>
          <p className="text-tertiary max-md:text-sm">{t("description")}</p>
        </span>
        <span>
          <Points className="text-lg max-md:text-sm max-sm:text-xs" />
          <Link
            to={"/redeem-history"}
            className="text-sm text-tertiary-light underline w-fit max-sm:text-xs"
          >
            {t("view_redeem_history")}
          </Link>
        </span>
        <RewardsTable />
      </div>
    </SectionWrapper>
  );
}
