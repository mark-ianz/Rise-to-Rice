import SectionWrapper from "@/components/general/SectionWrapper";
import SectionHeader from "./SectionHeader";
import AnnouncementSnippet from "./AnnouncementSnippet";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetRecentAnnouncements } from "@/hooks/query/useAnnouncement";
import { useTranslation } from "react-i18next";

export default function LatestPosts() {
  const { t } = useTranslation("landing_page");
  const { data } = useGetRecentAnnouncements();

  const recent_announcements = data?.result;
  const hasRecentAnnouncements =
    recent_announcements && recent_announcements?.length > 0 ? true : false;

  return (
    <SectionWrapper
      id="latest-posts"
      className="items-start flex-col pb-28 gap-20 max-lg:gap-10 z-40 bg-secondary-light"
    >
      <SectionHeader>{t("latest_announcements.title")}</SectionHeader>
      {hasRecentAnnouncements ? (
        <div className="px-20 flex flex-col gap-4 w-full max-md:px-10">
          <ol className="grid grid-cols-5 gap-4 w-full max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-xsm:grid-cols-1">
            {recent_announcements?.map((post, index) => (
              <AnnouncementSnippet
                key={index + post.title}
                announcement={post}
              />
            ))}
          </ol>
          <span className="flex justify-end text-tertiary max-lg:text-sm">
            <Link
              to={"/announcements"}
              className="hover:underline flex cursor-pointer items-center"
            >
              {t("latest_announcements.view_more")} <ChevronRight className="w-4 h-4" />
            </Link>
          </span>
        </div>
      ) : (
        <span className="text-tertiary px-20 w-full">
          {t("latest_announcements.no_recent_announcements")}
        </span>
      )}
    </SectionWrapper>
  );
}
