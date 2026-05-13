import SectionWrapper from "@/components/general/SectionWrapper";
import SectionHeader from "./SectionHeader";
import AnnouncementSnippet from "./AnnouncementSnippet";
import { ArrowRight } from "lucide-react";
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
      className="flex-col py-24 max-lg:py-20 max-md:py-16 bg-warm-beige"
    >
      <div className="w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <SectionHeader subtitle="Stay Updated">
          {t("latest_announcements.title")}
        </SectionHeader>
        
        {hasRecentAnnouncements ? (
          <div className="flex flex-col gap-8">
            <ol className="grid grid-cols-4 gap-6 w-full max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {recent_announcements?.slice(0, 4).map((post, index) => (
                <AnnouncementSnippet
                  key={index + post.title}
                  announcement={post}
                />
              ))}
            </ol>
            <div className="flex justify-center">
              <Link
                to={"/announcements"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-main text-white font-medium rounded-full hover:bg-primary-main-dark transition-colors duration-200 group"
              >
                {t("latest_announcements.view_more")} 
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-secondary-dark/50">
              {t("latest_announcements.no_recent_announcements")}
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
