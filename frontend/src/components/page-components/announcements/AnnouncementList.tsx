import AnnouncementListSkeleton from "@/components/skeletons/announcements/AnnouncementListSkeleton";
import AnnouncementCard from "./AnnouncementCard";
import { useGetAnnouncements } from "@/hooks/query/useAnnouncement";
import { useTranslation } from "react-i18next";
import GenericError from "@/components/general/GenericError";
import { Button } from "@/components/ui/button";
import AnnouncementCardSkeleton from "@/components/skeletons/announcements/AnnouncementCardSkeleton";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { FLARES, type FlareType } from "@/lib/flares";

export default function AnnouncementList() {
  const { t, i18n } = useTranslation("announcements");
  const currentLang = i18n.language || "en";
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort");
  const flareFilter = searchParams.get("flare") || "";

  const { data, isLoading, fetchNextPage, isFetchingNextPage, isFetching } =
    useGetAnnouncements(sort || "latest", flareFilter || undefined);

  // this is for infinite scroll
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isLoading) return <AnnouncementListSkeleton length={4} />;
  if (!data) return <GenericError />;

  const search = searchParams.get("search")?.toLowerCase() || "";
  const announcements = data?.pages.map((page) => page.result).flat() || [];

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (flareFilter && announcement.flare !== flareFilter) return false;
    if (!search) return true;
    return (
      announcement.title.toLowerCase().includes(search) ||
      (announcement.description && announcement.description.toLowerCase().includes(search))
    );
  });

  const totalItems = data.pages[0]?.total_items ?? 0;
  const displayCount = search ? filteredAnnouncements.length : totalItems;

  if (announcements.length === 0)
    return <p className="text-tertiary">{t("no_announcements")}</p>;

  if (filteredAnnouncements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center w-full">
        <Search className="w-10 h-10 text-slate-300 mb-3" />
        <h4 className="text-sm font-bold text-slate-700">{t("no_matching_announcements")}</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          {t("no_matching_subtext", { search: searchParams.get("search") })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Dynamic Results Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-widest flex flex-wrap items-center gap-2">
          <span>{t("title")} Feed</span>
          {flareFilter && FLARES[flareFilter as FlareType] ? (
            <span className="text-slate-500 font-semibold normal-case text-[11px] bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              — Showing {displayCount} {FLARES[flareFilter as FlareType].label[currentLang === "tl" ? "tl" : "en"]} {displayCount === 1 ? "announcement" : "announcements"}
            </span>
          ) : (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-extrabold bg-[#2D5A27]/10 dark:bg-emerald-950/30 text-[#2D5A27] dark:text-emerald-400 rounded-full border border-[#2D5A27]/20">
              {displayCount} {displayCount === 1 ? "update" : "updates"}
            </span>
          )}
        </h2>
        {search && (
          <span className="text-xs text-muted-foreground/60 italic max-sm:hidden">
            Showing results matching "{search}"
          </span>
        )}
      </div>

      <ul className={cn(
        "flex flex-col justify-center w-full gap-4 transition-all duration-300",
        isFetching && !isFetchingNextPage ? "opacity-50 pointer-events-none scale-[0.995]" : "opacity-100"
      )}>
        {filteredAnnouncements.map((announcement) => (
          <AnnouncementCard
            announcement={announcement}
            key={announcement.announcement_id}
          />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, index) => (
            <AnnouncementCardSkeleton key={`load-more-announcement-${index}`} />
          ))}
        {data.pages[data.pages.length - 1].hasNext && (
          <Button
            ref={ref}
            variant={"ghost"}
            className={cn(isFetchingNextPage && "hidden")}
          ></Button>
        )}
      </ul>
    </div>
  );
}
