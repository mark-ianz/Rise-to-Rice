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

export default function AnnouncementList() {
  const { t } = useTranslation("announcements");
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort");

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useGetAnnouncements(sort || "latest");

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
    if (!search) return true;
    return (
      announcement.title.toLowerCase().includes(search) ||
      (announcement.description && announcement.description.toLowerCase().includes(search))
    );
  });

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
    <ul className="flex flex-col justify-center w-full gap-4">
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
  );
}
