import HeaderText from "@/components/general/HeaderText";
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
import { Search, Calendar, Filter, Award, Recycle, Sparkles, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { subDays, startOfDay, formatISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Points } from "@/types/points";
import { useGetUserAnalytics } from "@/hooks/query/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import { Button } from "@/components/ui/button";

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

  // Fetch user points for Overview Dashboard Card 1
  const { data: pointsData, isLoading: isPointsLoading } = useQuery<Points>({
    queryKey: ["user-points"],
    queryFn: async () => {
      const response = await axios.get("/api/points/");
      return response.data;
    },
    enabled: !!state?.user_id,
  });

  // Fetch user analytics for Overview Dashboard Cards 2 and 3
  const { data: userAnalytics, isLoading: isAnalyticsLoading } = useGetUserAnalytics({
    user_id: state?.user_id,
    time: { value: "all_time", label: "All Time" },
  });

  const {
    data: activityData,
    isLoading,
    isError,
    isFetching,
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

  const isFilterActive = search !== "" || type !== "all" || dateRange !== "all" || status.length > 0;

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Pagination page count calculation
  const totalPages = Math.ceil((activityData?.total_items || 0) / 12);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);
      
      if (start === 1) {
        end = 5;
      } else if (end === totalPages) {
        start = totalPages - 4;
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  if (isError && !isLoading) return <GenericError />;

  const isEmpty = activityData?.result.length === 0;

  return (
    <SectionWrapper
      id="activity-history"
      className="px-20 items-center py-10 justify-center max-md:px-10 max-sm:px-6"
    >
      <Helmet>
        <title>{t("activity_history.title")} | Rise to Rice</title>
      </Helmet>

      <div className="max-w-screen-lg w-full">
        {/* Title area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <HeaderText className="mb-1">{t("activity_history.title")}</HeaderText>
            <p className="text-muted-foreground">{t("activity_history.subtitle")}</p>
          </div>
        </div>

        {/* Dashboard Metrics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Available Points */}
          <div className="relative overflow-hidden bg-white dark:bg-card border border-slate-100 dark:border-border/10 p-6 rounded-2xl shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/10">
              <Award size={24} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">Available Points</span>
              {isPointsLoading ? (
                <Skeleton className="h-7 w-20 mt-1" />
              ) : (
                <span className="text-2xl font-extrabold text-secondary-dark dark:text-foreground tracking-tight mt-0.5">
                  {formatNumberWithCommasAndDecimals(pointsData?.points_accumulated)} <span className="text-xs font-semibold text-muted-foreground/80 tracking-normal">pts</span>
                </span>
              )}
              <span className="text-[10px] text-muted-foreground/80 leading-none">Ready for reward redemptions</span>
            </div>
          </div>

          {/* Card 2: Recycling Drop-offs */}
          <div className="relative overflow-hidden bg-white dark:bg-card border border-slate-100 dark:border-border/10 p-6 rounded-2xl shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/10">
              <Recycle size={24} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">Recycling Drop-offs</span>
              {isAnalyticsLoading ? (
                <Skeleton className="h-7 w-20 mt-1" />
              ) : (
                <span className="text-2xl font-extrabold text-secondary-dark dark:text-foreground tracking-tight mt-0.5">
                  {userAnalytics?.total_exchange_count ?? 0} <span className="text-xs font-semibold text-muted-foreground/80 tracking-normal font-sans">times</span>
                </span>
              )}
              <span className="text-[10px] text-muted-foreground/80 leading-none">Total waste exchanges completed</span>
            </div>
          </div>

          {/* Card 3: Lifetime Points Earned */}
          <div className="relative overflow-hidden bg-white dark:bg-card border border-slate-100 dark:border-border/10 p-6 rounded-2xl shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-500/10">
              <Sparkles size={24} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">Lifetime Points Earned</span>
              {isAnalyticsLoading ? (
                <Skeleton className="h-7 w-20 mt-1" />
              ) : (
                <span className="text-2xl font-extrabold text-secondary-dark dark:text-foreground tracking-tight mt-0.5">
                  {formatNumberWithCommasAndDecimals(userAnalytics?.total_points)} <span className="text-xs font-semibold text-muted-foreground/80 tracking-normal font-sans">pts</span>
                </span>
              )}
              <span className="text-[10px] text-muted-foreground/80 leading-none">Accumulated lifetime contributions</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar Panel */}
        <div className="p-4 bg-white dark:bg-card border border-slate-100 dark:border-border/10 rounded-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          {/* Left: Inputs & Selector fields */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder={t("activity_history.search_activities_placeholder")}
                className="pl-10 bg-white dark:bg-card border-slate-100 dark:border-border/10"
                defaultValue={search}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateParams("search", e.currentTarget.value);
                }}
                onBlur={(e) => updateParams("search", e.target.value)}
              />
            </div>

            <Select value={type} onValueChange={(v) => updateParams("type", v)}>
              <SelectTrigger className="w-[150px] bg-white dark:bg-card border-slate-100 dark:border-border/10">
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
              <SelectTrigger className="w-[150px] bg-white dark:bg-card border-slate-100 dark:border-border/10">
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

          {/* Right: Counter and Reset triggers */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-50 dark:border-border/10 shrink-0">
            {!isLoading && (
              <span className="text-xs font-semibold text-muted-foreground/60 tracking-wider">
                {formatNumberWithCommasAndDecimals(activityData?.total_items || 0, 0)} {activityData?.total_items === 1 ? "activity" : "activities"}
              </span>
            )}
            
            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#C68B59] hover:text-[#C68B59]/80 flex items-center gap-1 transition-colors duration-200"
              >
                <XCircle size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {type === "redeem" && (
          <div className="flex flex-wrap items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mr-2">
              Status:
            </span>
            {[
              { id: "pending", label: t("redeem_history.status.pending"), bg: "bg-amber-500/10 dark:bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
              { id: "for pick up", label: t("redeem_history.status.for pick up"), bg: "bg-sky-500/10 dark:bg-sky-500/20", border: "border-sky-500/30", text: "text-sky-600 dark:text-sky-400" },
              { id: "rejected", label: t("redeem_history.status.rejected"), bg: "bg-rose-500/10 dark:bg-rose-500/20", border: "border-rose-500/30", text: "text-rose-600 dark:text-rose-400" },
              { id: "completed", label: t("redeem_history.status.completed"), bg: "bg-emerald-500/10 dark:bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
              { id: "cancelled", label: t("redeem_history.status.cancelled"), bg: "bg-slate-500/10 dark:bg-slate-500/20", border: "border-slate-500/30", text: "text-slate-600 dark:text-slate-400" },
            ].map((filter) => {
              const isActive = status.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    const prevStatus = searchParams.getAll("status");
                    newParams.delete("status");
                    
                    if (isActive) {
                      prevStatus.filter((s) => s !== filter.id).forEach((s) => newParams.append("status", s));
                    } else {
                      [...prevStatus, filter.id].forEach((s) => newParams.append("status", s));
                    }
                    newParams.set("page", "1");
                    setSearchParams(newParams);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border flex items-center gap-1.5 shadow-sm hover:scale-[1.03] active:scale-95 ${
                    isActive
                      ? `${filter.bg} ${filter.border} ${filter.text} ring-2 ring-[#C68B59]/20`
                      : "bg-white dark:bg-card border-slate-100 dark:border-border/10 text-muted-foreground/80 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-current" : "bg-muted-foreground/30 animate-pulse"}`} />
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Chronological List Timeline Section */}
        <div className={`my-6 transition-all duration-300 ${isFetching ? "opacity-50 pointer-events-none scale-[0.995]" : "opacity-100"}`}>
          {isLoading ? (
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RedeemHistoryCardSkeleton length={12} />
            </ol>
          ) : (
            !isEmpty && (
              <ol className="relative border-slate-100 dark:border-border/10 pl-0">
                {activityData?.result.map((activity) => (
                  <ActivityHistoryCard
                    key={`${activity.activity_type}-${activity.id}`}
                    activity={activity}
                  />
                ))}
              </ol>
            )
          )}
        </div>

        {isEmpty && !isLoading && (
          <div className="text-center py-20 bg-warm-beige/30 dark:bg-card/20 rounded-3xl border border-dashed border-warm-tan/30">
            <p className="text-lg font-medium text-secondary-dark/60 dark:text-zinc-400">{t("activity_history.no_activity")}</p>
            <p className="text-sm text-secondary-dark/40 dark:text-zinc-500 mt-1">{t("activity_history.start_recycling")}</p>
          </div>
        )}

        {/* Premium Pagination Bar */}
        {!isEmpty && !isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-100 dark:border-border/10">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-secondary-dark dark:text-foreground">{Math.min(activityData?.result.length || 0, 12)}</span> of <span className="font-semibold text-secondary-dark dark:text-foreground">{formatNumberWithCommasAndDecimals(activityData?.total_items || 0, 0)}</span> activities
            </p>

            <div className="flex items-center gap-1.5">
              {/* Previous page trigger */}
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", (page - 1).toString());
                  setSearchParams(newParams);
                }}
                className="h-8 px-2.5 rounded-lg border-slate-100 dark:border-border/10 text-xs font-semibold gap-1 hover:bg-[#C68B59]/5 hover:text-[#C68B59] hover:border-[#C68B59]/20"
              >
                <ChevronLeft size={14} /> Previous
              </Button>

              {/* Numbered selections */}
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={`page-number-${pageNum}`}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set("page", pageNum.toString());
                    setSearchParams(newParams);
                  }}
                  className={`h-8 w-8 p-0 rounded-lg text-xs font-bold transition-all duration-200 ${
                    page === pageNum
                      ? "bg-[#C68B59] text-white hover:bg-[#C68B59]/90 border-none shadow-sm"
                      : "border-slate-100 dark:border-border/10 hover:bg-[#C68B59]/5 hover:text-[#C68B59] hover:border-[#C68B59]/20 text-muted-foreground hover:text-[#C68B59]"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}

              {/* Next page trigger */}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", (page + 1).toString());
                  setSearchParams(newParams);
                }}
                className="h-8 px-2.5 rounded-lg border-slate-100 dark:border-border/10 text-xs font-semibold gap-1 hover:bg-[#C68B59]/5 hover:text-[#C68B59] hover:border-[#C68B59]/20"
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
