import { useGetRecentAnnouncements } from "@/hooks/query/useAnnouncement";
import AnnouncementSnippet from "@/components/page-components/landing page/AnnouncementSnippet";
import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentAnnouncements() {
  const { data, isLoading } = useGetRecentAnnouncements();

  const recentAnnouncements = data?.result?.slice(0, 3) || [];
  const hasAnnouncements = recentAnnouncements.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-secondary-dark/70 uppercase tracking-wider flex items-center gap-2">
          <Bell size={16} className="text-primary-main" />
          Latest Announcements
        </h2>
        <Link
          to="/announcements"
          className="inline-flex items-center gap-1.5 text-primary-main text-sm font-medium hover:underline group"
        >
          View all announcements
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-warm-beige/50 rounded-2xl overflow-hidden"
            >
              <Skeleton className="w-full aspect-video" />
              <div className="p-5 flex flex-col gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-16 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : hasAnnouncements ? (
        <ol className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {recentAnnouncements.map((post, index) => (
            <AnnouncementSnippet
              key={index + post.title}
              announcement={post}
            />
          ))}
        </ol>
      ) : (
        <div className="text-center py-12 bg-warm-beige/50 rounded-2xl">
          <Bell className="w-10 h-10 text-secondary-dark/15 mx-auto mb-3" />
          <p className="text-secondary-dark/40">No announcements yet</p>
        </div>
      )}
    </div>
  );
}
