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
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold line-clamp-1 max-md:line-clamp-2">{announcement.title}</p>
      {announcement.description && (
        <p className={cn("text-sm whitespace-pre-line", !viewing && "line-clamp-6 ")}>
          {announcement.description.replace(/\n/g, "\n")}
        </p>
      )}
      {announcement.image_url && (
        <ViewImage src={announcement.image_url} alt={announcement.title}>
          <ImageDisplay src={announcement.image_url} alt={announcement.title} containerClassName={cn(viewing && "max-h-[600px]")}/>
        </ViewImage>
      )}
    </div>
  );
}
