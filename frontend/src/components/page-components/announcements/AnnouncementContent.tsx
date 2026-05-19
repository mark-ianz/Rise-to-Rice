import { useRef, useState, useEffect } from "react";
import { Announcement } from "@/types/announcements";
import ImageDisplay from "./ImageDisplay";
import ViewImage from "@/components/general/ViewImage";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getAnnouncementUrl } from "@/utils/url";
import { useTranslation } from "react-i18next";

type Props = {
  announcement: Announcement;
  viewing?: boolean;
};

export default function AnnouncementContent({ announcement, viewing }: Props) {
  const { t } = useTranslation("announcements");
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // scrollHeight > clientHeight means the text has overflowed and is clamped
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    // Run check initially
    checkTruncation();

    // Recheck on window resize for responsive layout changes
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [announcement.description]);

  return (
    <div className="flex flex-col gap-3">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-snug hover:text-emerald-700 transition-colors">
        <Link to={getAnnouncementUrl(announcement)}>{announcement.title}</Link>
      </h2>

      {/* Description Body */}
      {announcement.description && (
        <div className="relative overflow-hidden">
          <p
            ref={textRef}
            className={cn(
              "text-sm sm:text-base text-slate-600 whitespace-pre-line leading-relaxed font-roboto transition-all duration-300",
              !viewing && "line-clamp-6 pb-2"
            )}
          >
            {announcement.description.replace(/\n/g, "\n")}
          </p>
          {!viewing && isTruncated && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          )}
        </div>
      )}

      {!viewing && isTruncated && (
        <Link
          to={getAnnouncementUrl(announcement)}
          className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1.5 transition-all select-none w-fit animate-fadeIn"
        >
          <span>{t("read_more_indicator")}</span>
        </Link>
      )}

      {/* Media Content (Image) with dynamic zoom container */}
      {announcement.image_url && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-50 mt-2 transition-all duration-300 hover:shadow-md max-w-full">
          <ViewImage src={announcement.image_url} alt={announcement.title}>
            <div className="group overflow-hidden w-full cursor-zoom-in">
              <ImageDisplay
                src={announcement.image_url}
                alt={announcement.title}
                containerClassName={cn(
                  "aspect-video max-h-[480px] bg-slate-50 w-full rounded-2xl overflow-hidden",
                  viewing && "max-h-[600px]"
                )}
                imgClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] rounded-2xl"
              />
            </div>
          </ViewImage>
        </div>
      )}
    </div>
  );
}
