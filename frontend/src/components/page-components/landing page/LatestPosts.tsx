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
      className="items-start flex-col pb-28 gap-16 max-lg:gap-10 z-40 bg-secondary-light"
    >
      <SectionHeader>{t("latest_announcements.title")}</SectionHeader>
      {hasRecentAnnouncements ? (
        <div className="px-20 flex flex-col gap-6 w-full max-lg:px-10 max-sm:px-6">
          <ol className="grid grid-cols-5 gap-5 w-full max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-xsm:grid-cols-1">
            {recent_announcements?.map((post, index) => (
              <AnnouncementSnippet
                key={index + post.title}
                announcement={post}
              />
            ))}
          </ol>
          <div className="flex justify-end">
            <Link
              to={"/announcements"}
              className="flex items-center gap-1 text-tertiary font-medium hover:text-tertiary-dark transition-colors duration-200 max-lg:text-sm group"
            >
              {t("latest_announcements.view_more")} 
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-tertiary px-20 w-full max-lg:px-10 max-sm:px-6 py-10">
          <p className="text-center text-lg max-md:text-base opacity-70">
            {t("latest_announcements.no_recent_announcements")}
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
