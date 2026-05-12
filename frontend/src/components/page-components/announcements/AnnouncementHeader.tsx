import DateDifference from "@/components/general/DateDifference";
import { Announcement } from "@/types/announcements";
import RiceToRiceLogo from "@/assets/COMPONY LOGO NO BG.png";
import { displayFullName } from "@/lib/format";
import {
  useDeleteAnnouncement,
  useGetAuthor,
} from "@/hooks/query/useAnnouncement";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteData from "../dashboard/DeleteData";
import EditAnnouncementButton from "./EditAnnouncementButton";

type Props = {
  announcement: Announcement;
};

export default function AnnouncementHeader({ announcement }: Props) {
  const { data: author } = useGetAuthor(announcement.announcement_id);

  return (
    <div className="flex gap-2 justify-between">
      <div className="flex gap-2">
        <span className="w-12 h-12">
          <img
            loading="lazy"
            alt="Logo of Rise to Rice"
            src={RiceToRiceLogo}
            aria-hidden
            className="w-full h-full object-cover"
          />
        </span>
        <span>
          <p className="text-primary-main font-semibold max-sm:text-sm">
            {author ? displayFullName(author) : "Deleted User"}
          </p>
          <DateDifference className="-mt-1" date={announcement.createdAt} />
        </span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"icon"} className="rounded-full" variant={"ghost"}>
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 max-w-[200px]" align="end">
          <EditAnnouncementButton announcement={announcement}/>
          <DeleteData
            useMutation_hook={useDeleteAnnouncement}
            description="This action cannot be undone. This will permanently delete announcement."
            id={announcement.announcement_id}
            resource_name="announcement"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
