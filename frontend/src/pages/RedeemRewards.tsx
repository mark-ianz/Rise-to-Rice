import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Points as PointsType } from "@/types/points";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import RewardsTable from "@/components/page-components/redeem-rewards/RewardsTable";
import SectionWrapper from "@/components/general/SectionWrapper";
import Loading from "@/components/general/Loading";
import { Coins, History, ArrowRight, Gift, Sparkles, ShieldCheck } from "lucide-react";

export default function RedeemRewards() {
  const { t } = useTranslation("redeem_rewards");

  // Query user points balance directly in the parent page to fuel the wallet card
  const { data: pointsData, isLoading: isPointsLoading } = useQuery<PointsType>({
    queryKey: ["user-points"],
    queryFn: async () => {
      const response = await axios.get("/api/points/");
      return response.data;
    },
  });

  const userPoints = pointsData?.points_accumulated ?? 0;

  return (
    <SectionWrapper
      id="redeem-rewards"
      className="px-4 sm:px-10 lg:px-20 py-8 pb-20 justify-center items-center bg-[#FAF8F5] min-h-screen"
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

      {/* Main Container */}
      <div className="max-w-6xl w-full flex flex-col gap-8">

        {/* Modern Curved Hero Header */}
        <div className="relative overflow-hidden w-full bg-white rounded-3xl border border-border/40 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E8F4E5]/30 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="flex flex-col gap-3 relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 bg-[#E8F4E5] text-[#2D5A27] px-3 py-1 rounded-full text-xs font-semibold w-fit">
              <Gift size={13} className="shrink-0" />
              <span>{t("custom_redesign.program_tag")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="shrink-0 relative z-10 w-16 h-16 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Gift size={28} />
          </div>
        </div>

        {/* Dashboard Content: Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

          {/* Left Column: Rewards catalog (takes up more space) */}
          <div className="w-full lg:flex-1 order-2 lg:order-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                {t("custom_redesign.catalog_title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("custom_redesign.catalog_subtitle")}
              </p>
            </div>
            <RewardsTable />
          </div>

          {/* Right Column: Sticky wallet balance (top on mobile, sticky sidebar on desktop) */}
          <div className="w-full lg:w-[325px] order-1 lg:order-2 shrink-0 lg:sticky lg:top-24 flex flex-col gap-6">

            {/* Emerald Premium Points Wallet - Balanced Sage-Green Theme */}
            <div className="w-full bg-gradient-to-br from-[#E8F4E5] to-[#D5ECD0]/70 rounded-3xl p-6 shadow-sm border border-[#2D5A27]/15 relative overflow-hidden group">
              {/* Decorative Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27]/30 via-[#2D5A27] to-[#2D5A27]/50"></div>
              
              <div className="flex flex-col gap-5 relative z-10">
                {/* Header info */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2D5A27]/70 flex items-center gap-1.5">
                    <Coins size={14} className="text-[#2D5A27]" />
                    {t("custom_redesign.points_wallet_title")}
                  </span>
                </div>

                {/* Balance figures */}
                <div className="flex flex-col gap-1.5">
                  {isPointsLoading ? (
                    <div className="h-10 flex items-center">
                      <Loading size={24} />
                    </div>
                  ) : (
                    <h2 className="text-4xl font-extrabold tracking-tight text-secondary-dark flex items-baseline gap-1">
                      {formatNumberWithCommasAndDecimals(userPoints)}
                      <span className="text-xs font-bold tracking-normal text-secondary-dark/65 ml-1">pts</span>
                    </h2>
                  )}
                  <p className="text-xs text-[#2D5A27]/85 leading-normal font-medium">
                    {t("custom_redesign.points_wallet_helper")}
                  </p>
                </div>

                <div className="h-px bg-[#2D5A27]/15 w-full" />

                {/* View history navigation button */}
                <Link
                  to="/activity-history"
                  className="w-full h-11 bg-[#2D5A27] hover:bg-[#1E3B1A] text-white active:scale-[0.98] transition-all rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer group/btn"
                >
                  <History size={14} />
                  {t("view_redeem_history")}
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Quick Eco Tip Card */}
            <div className="bg-[#E8F4E5]/40 border border-[#2D5A27]/10 rounded-2xl p-5 flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#2D5A27]/10 flex items-center justify-center shrink-0 text-[#2D5A27]">
                <Sparkles size={16} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-bold text-[#2D5A27]">{t("custom_redesign.quick_tip_title")}</h4>
                <p className="text-[11px] leading-relaxed text-[#2D5A27]/80">
                  {t("custom_redesign.quick_tip_text")}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
