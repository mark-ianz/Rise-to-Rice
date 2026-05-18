import { Announcement } from "@/types/announcements";
import ImageDisplay from "./ImageDisplay";
import ViewImage from "@/components/general/ViewImage";
import { cn } from "@/lib/utils";

type Props = {
  announcement: Announcement;
  viewing?: boolean;
};

export default function AnnouncementContent({ announcement, viewing }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-snug hover:text-emerald-700 transition-colors">
        {announcement.title}
      </h2>

      {/* Description Body */}
      {announcement.description && (
        <p className={cn(
          "text-sm sm:text-base text-slate-600 whitespace-pre-line leading-relaxed font-roboto",
          !viewing && "line-clamp-6"
        )}>
          {announcement.description.replace(/\n/g, "\n")}
        </p>
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
