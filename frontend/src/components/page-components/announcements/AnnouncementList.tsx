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

export default function AnnouncementList() {
  const { t } = useTranslation("announcements");
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort");

  const { data, isLoading, fetchNextPage, isFetchingNextPage, refetch } =
    useGetAnnouncements(sort || "latest");

  useEffect(() => {
    refetch();
  }, [sort, refetch]);

  // this is for infinite scroll
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isLoading) return <AnnouncementListSkeleton length={4} />;
  if (!data) return <GenericError />;

  const announcements = data?.pages.map((page) => page.result).flat();

  if (announcements.length === 0)
    return <p className="text-tertiary">{t("no_announcements")}</p>;

  return (
    <ul className="flex flex-col justify-center w-full gap-4">
      {announcements.map((announcement) => (
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
