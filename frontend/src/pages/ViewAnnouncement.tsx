import GoBackButton from "@/components/general/GoBackButton";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import NotFoundPage from "@/components/page-components/NotFoundPage";
import { 
  useGetSingleAnnouncement, 
  useGetRecentAnnouncements, 
  useGetAuthor,
  useDeleteAnnouncement
} from "@/hooks/query/useAnnouncement";
import { Helmet } from "react-helmet-async";
import ImageDisplay from "@/components/page-components/announcements/ImageDisplay";
import ViewImage from "@/components/general/ViewImage";
import ReactionCount from "@/components/page-components/announcements/reactions/ReactionCount";
import AnnouncementFooter from "@/components/page-components/announcements/AnnouncementFooter";
import { displayFullName } from "@/lib/format";
import companyLogo from "@/assets/COMPONY LOGO NO BG.png";
import { Clock, BookOpen, ChevronRight, Award, Trash2, Pencil, ShieldAlert, Leaf, Ellipsis } from "lucide-react";
import DateDifference from "@/components/general/DateDifference";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import EditAnnouncementButton from "@/components/page-components/announcements/EditAnnouncementButton";
import DeleteData from "@/components/page-components/dashboard/DeleteData";
import useUserContext from "@/hooks/useUserContext";

function ViewAnnouncementSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column Skeleton */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-24 h-4 rounded animate-pulse bg-slate-100" />
          <Skeleton className="w-4 h-4 rounded animate-pulse bg-slate-100" />
          <Skeleton className="w-32 h-4 rounded animate-pulse bg-slate-100" />
        </div>
        <Skeleton className="w-3/4 h-10 rounded-xl animate-pulse bg-slate-100" />
        <div className="flex items-center gap-4 py-4 border-y border-slate-100">
          <Skeleton className="w-12 h-12 rounded-full animate-pulse bg-slate-100" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-28 h-4 rounded animate-pulse bg-slate-100" />
            <Skeleton className="w-20 h-3 rounded animate-pulse bg-slate-100" />
          </div>
        </div>
        <Skeleton className="w-full aspect-[21/9] min-h-[300px] rounded-3xl animate-pulse bg-slate-100" />
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full h-4 rounded animate-pulse bg-slate-100" />
          <Skeleton className="w-full h-4 rounded animate-pulse bg-slate-100" />
          <Skeleton className="w-5/6 h-4 rounded animate-pulse bg-slate-100" />
        </div>
      </div>
      {/* Right Column Skeleton */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col gap-4">
          <Skeleton className="w-1/2 h-6 rounded animate-pulse bg-slate-100" />
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0 animate-pulse bg-slate-100" />
                <div className="flex flex-col gap-1 w-full">
                  <Skeleton className="w-full h-4 rounded animate-pulse bg-slate-100" />
                  <Skeleton className="w-1/2 h-3 rounded animate-pulse bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("announcements");
  const { state: user } = useUserContext();
  const isAdmin = user?.isAdmin;

  const { data: announcement, isLoading } = useGetSingleAnnouncement(
    Number(id)
  );

  const { data: author } = useGetAuthor(announcement?.announcement_id || 0);
  const { data: recentData, isLoading: recentLoading } = useGetRecentAnnouncements();

  if (!announcement && !isLoading) {
    return (
      <SectionWrapper
        id="view-announcement"
        className="flex flex-col justify-start py-10 pb-20 bg-slate-50"
      >
        <NotFoundPage />
      </SectionWrapper>
    );
  }

  const recentAnnouncements = recentData?.result || [];
  const filteredRecent = recentAnnouncements.filter(
    (a) => a.announcement_id !== announcement?.announcement_id
  );

  const calculateReadingTime = (text?: string) => {
    if (!text) return "1 min read";
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s+/).length;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <SectionWrapper
      id="view-announcement"
      className="flex flex-col justify-start p-10 pb-20 bg-slate-50/50 max-md:px-6 animate-fadeIn"
    >
      <Helmet>
        <title>{announcement ? `${announcement.title} | Rise to Rice` : "Loading... | Rise to Rice"}</title>
        <meta name="description" content={announcement?.description || "Rise to Rice Announcement"} />
        <meta name="robots" content="index, follow" />
        {announcement && (
          <link
            rel="canonical"
            href={`https://risetorice.com/announcements/${announcement.announcement_id}`}
          />
        )}
      </Helmet>

      <div className="w-full max-w-screen-xl mx-auto flex flex-col items-start gap-8">
        {/* Navigation Breadcrumbs & Back Button */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoBackButton
              variant="secondary"
              className="static bg-white border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:brightness-100 text-slate-600 transition-all w-10 h-10 flex items-center justify-center"
            />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 max-sm:hidden">
              <Link to="/home" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link to="/announcements" className="hover:text-emerald-600 transition-colors">Announcements</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 line-clamp-1 max-w-[200px] font-bold">Detail</span>
            </div>
          </div>
        </div>

        {isLoading && <ViewAnnouncementSkeleton />}

        {announcement && !isLoading && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Announcement Details */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 max-md:p-6 flex flex-col gap-6">
              
              {/* Header Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {announcement.title}
              </h1>

              {/* Author & Publish Info Bar */}
              <div className="flex items-center justify-between border-y border-slate-100 py-4 w-full">
                <div className="flex gap-3 items-center">
                  {/* Brand Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-emerald-100/50 shadow-sm flex items-center justify-center bg-white p-1 select-none">
                    <img
                      loading="lazy"
                      alt="Rise to Rice Logo"
                      src={companyLogo}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Text Metadata */}
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                        {author ? displayFullName(author) : "Deleted User"}
                      </h3>
                      {(author?.role === "admin" || author?.role === "super_admin") && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Admin
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2.5 text-xs text-slate-400 mt-1 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <DateDifference date={announcement.createdAt} />
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {calculateReadingTime(announcement.description)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Control Panel actions for Admins */}
                {isAdmin && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size={"icon"} className="rounded-full w-9 h-9 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" variant={"ghost"}>
                        <Ellipsis className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-1 p-1.5 rounded-2xl shadow-xl border border-slate-100 w-48" align="end">
                      <div className="px-2 py-1.5 mb-1 border-b border-slate-50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> Control Panel
                        </span>
                      </div>

                      <EditAnnouncementButton announcement={announcement}>
                        <button className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all text-left">
                          <Pencil className="w-3.5 h-3.5 text-emerald-500" />
                          Edit Announcement
                        </button>
                      </EditAnnouncementButton>

                      <DeleteData
                        useMutation_hook={useDeleteAnnouncement}
                        description="This action cannot be undone. This will permanently delete the announcement."
                        id={announcement.announcement_id}
                        resource_name="announcement"
                      >
                        <button className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all text-left">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          Delete Announcement
                        </button>
                      </DeleteData>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Media Content (Hero Image) */}
              {announcement.image_url && (
                <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] bg-slate-50 relative group">
                  <ViewImage src={announcement.image_url} alt={announcement.title}>
                    <div className="overflow-hidden w-full cursor-zoom-in">
                      <ImageDisplay
                        src={announcement.image_url}
                        alt={announcement.title}
                        containerClassName="aspect-[21/9] min-h-[250px] md:min-h-[350px] bg-slate-50 w-full overflow-hidden"
                        imgClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </ViewImage>
                </div>
              )}

              {/* Rich Body Content */}
              {announcement.description && (
                <div className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-line font-roboto my-2 select-text selection:bg-emerald-100">
                  {announcement.description}
                </div>
              )}

              {/* Engagement Hub */}
              <div className="flex flex-col gap-4 mt-6 border-t border-slate-100 pt-6">
                <ReactionCount announcement_id={announcement.announcement_id} />
                <div className="border-t border-slate-100/80 w-full" />
                <AnnouncementFooter viewing announcement={announcement} />
              </div>

            </div>

            {/* Right Column: Sidebar Widgets */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              
              {/* Recent Announcements Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 flex flex-col gap-5">
                <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-50 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  Recent Updates
                </h3>
                
                {recentLoading && (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0 animate-pulse bg-slate-100" />
                        <div className="flex flex-col gap-1 w-full justify-center">
                          <Skeleton className="w-full h-4 rounded animate-pulse bg-slate-100" />
                          <Skeleton className="w-1/2 h-3 rounded animate-pulse bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!recentLoading && filteredRecent.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No other recent announcements.</p>
                )}

                {!recentLoading && filteredRecent.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {filteredRecent.slice(0, 3).map((item) => (
                      <Link
                        key={item.announcement_id}
                        to={`/announcements/${item.announcement_id}`}
                        className="group flex gap-4 p-2.5 rounded-2xl hover:bg-emerald-50/50 transition-all duration-300 border border-transparent hover:border-emerald-100/50"
                      >
                        {/* Mini Thumbnail */}
                        {item.image_url ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 group-hover:scale-95 transition-transform duration-300">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-100/50 flex-shrink-0 flex items-center justify-center group-hover:scale-95 transition-transform duration-300">
                            <Leaf className="w-6 h-6 text-emerald-600" />
                          </div>
                        )}
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <DateDifference date={item.createdAt} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Premium Green Rise to Rice CTA */}
              <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-800">
                {/* Absolute glow design elements */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl" />
                
                <div className="relative flex flex-col gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-inner">
                    <Award className="w-5 h-5 text-emerald-300" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold text-lg tracking-tight text-white leading-snug">
                      Recycle & Earn Rewards
                    </h3>
                    <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                      Ready to make a difference? Bring your clean recyclables to our hubs, collect points, and redeem them for awesome green rewards!
                    </p>
                  </div>
                  
                  <Link 
                    to="/redeem" 
                    className="mt-2 text-center text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 hover:brightness-105 py-3 px-4 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    Browse Rewards
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
