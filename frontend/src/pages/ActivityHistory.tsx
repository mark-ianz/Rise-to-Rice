import HeaderText from "@/components/general/HeaderText";
import SearchPagination from "@/components/page-components/dashboard/SearchPagination";
import ActivityHistoryCard from "@/components/page-components/activity-history/ActivityHistoryCard";
import SectionWrapper from "@/components/general/SectionWrapper";
import useUserContext from "@/hooks/useUserContext";
import { useSearchParams } from "react-router-dom";
import { useGetUserActivity } from "@/hooks/query/useUserActivity";
import GenericError from "@/components/general/GenericError";
import RedeemHistoryCardSkeleton from "@/components/skeletons/RedeemHistoryCardSkeleton";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Filter } from "lucide-react";
import { subDays, startOfDay, formatISO } from "date-fns";
import StatusCheckBoxFilter from "@/components/page-components/dashboard/redeem-request/StatusCheckBoxFilter";

export default function ActivityHistory() {
  const { state } = useUserContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("redeem_rewards");

  const type = searchParams.get("type") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const dateRange = searchParams.get("dateRange") || "all";
  const status = searchParams.getAll("status");

  let startDate: string | undefined;
  if (dateRange !== "all") {
    const now = new Date();
    if (dateRange === "today") startDate = formatISO(startOfDay(now));
    else if (dateRange === "7d") startDate = formatISO(subDays(now, 7));
    else if (dateRange === "30d") startDate = formatISO(subDays(now, 30));
  }

  const {
    data: activityData,
    isLoading,
    isError,
  } = useGetUserActivity({
    userId: state?.user_id,
    page,
    limit: 12,
    type: type === "all" ? undefined : type,
    search: search || undefined,
    startDate,
    status: status.length > 0 ? status : undefined,
  });

  const updateParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === "all" || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  if (isError && !isLoading) return <GenericError />;

  const isEmpty = activityData?.result.length === 0;

  return (
    <SectionWrapper
      id="activity-history"
      className="px-20 items-start py-10 justify-center max-md:px-10 max-sm:px-6"
    >
      <Helmet>
        <title>{t("activity_history.title")} | Rise to Rice</title>
      </Helmet>

      <div className="max-w-screen-lg w-full">
        <div className="flex flex-col gap-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <HeaderText className="mb-1">{t("activity_history.title")}</HeaderText>
              <p className="text-muted-foreground">{t("activity_history.subtitle")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder={t("activity_history.search_rewards_placeholder")}
                  className="pl-10 bg-white"
                  defaultValue={search}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateParams("search", e.currentTarget.value);
                  }}
                  onBlur={(e) => updateParams("search", e.target.value)}
                />
              </div>

              <Select value={type} onValueChange={(v) => updateParams("type", v)}>
                <SelectTrigger className="w-[150px] bg-white">
                  <Filter className="mr-2 text-muted-foreground" size={16} />
                  <SelectValue placeholder={t("activity_history.type_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("activity_history.all_activities")}</SelectItem>
                  <SelectItem value="exchange">{t("activity_history.exchanges")}</SelectItem>
                  <SelectItem value="redeem">{t("activity_history.redemptions")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={(v) => updateParams("dateRange", v)}>
                <SelectTrigger className="w-[150px] bg-white">
                  <Calendar className="mr-2 text-muted-foreground" size={16} />
                  <SelectValue placeholder={t("activity_history.date_range_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("activity_history.all_time")}</SelectItem>
                  <SelectItem value="today">{t("activity_history.today")}</SelectItem>
                  <SelectItem value="7d">{t("activity_history.last_7_days")}</SelectItem>
                  <SelectItem value="30d">{t("activity_history.last_30_days")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === "redeem" && (
            <div className="p-4 bg-warm-beige/20 rounded-2xl border border-warm-tan/10">
              <p className="text-xs font-semibold text-secondary-dark/60 uppercase tracking-wider mb-3">{t("activity_history.status_filter")}</p>
              <StatusCheckBoxFilter />
            </div>
          )}
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
          {isLoading ? (
            <RedeemHistoryCardSkeleton length={12} />
          ) : (
            activityData?.result.map((activity) => (
              <ActivityHistoryCard
                key={`${activity.activity_type}-${activity.id}`}
                activity={activity}
              />
            ))
          )}
        </ol>

        {isEmpty && !isLoading && (
          <div className="text-center py-20 bg-warm-beige/30 rounded-3xl border border-dashed border-warm-tan/30">
            <p className="text-lg font-medium text-secondary-dark/60">{t("activity_history.no_activity")}</p>
            <p className="text-sm text-secondary-dark/40 mt-1">{t("activity_history.start_recycling")}</p>
          </div>
        )}

        {!isEmpty && !isLoading && (
          <div className="mt-8">
            <SearchPagination
              hasNext={activityData?.hasNext}
              hasPrev={activityData?.hasPrev}
            />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
