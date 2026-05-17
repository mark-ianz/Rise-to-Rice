import DateDifference from "@/components/general/DateDifference";
import { Announcement } from "@/types/announcements";
import { displayFullName } from "@/lib/format";
import {
  useDeleteAnnouncement,
  useGetAuthor,
} from "@/hooks/query/useAnnouncement";
import { Button } from "@/components/ui/button";
import { Ellipsis, Clock, ShieldAlert } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteData from "../dashboard/DeleteData";
import EditAnnouncementButton from "./EditAnnouncementButton";
import companyLogo from "@/assets/COMPONY LOGO NO BG.png";

type Props = {
  announcement: Announcement;
};

export default function AnnouncementHeader({ announcement }: Props) {
  const { data: author } = useGetAuthor(announcement.announcement_id);

  return (
    <div className="flex gap-3 justify-between items-center w-full">
      <div className="flex gap-3 items-center">
        {/* Rise to Rice Brand Logo Avatar */}
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
            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight hover:text-emerald-700 transition-colors">
              {author ? displayFullName(author) : "Deleted User"}
            </h3>
            {author?.isAdmin && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Admin
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <DateDifference className="text-slate-400 font-medium hover:text-emerald-600 hover:no-underline transition-colors" date={announcement.createdAt} />
          </span>
        </div>
      </div>

      {/* Popover actions for Admins / Authorized users */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"icon"} className="rounded-full w-9 h-9 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" variant={"ghost"}>
            <Ellipsis className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-1.5 p-2 rounded-2xl shadow-xl border border-slate-100 w-44" align="end">
          <div className="px-2 py-1 mb-1 border-b border-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Actions
            </span>
          </div>
          <EditAnnouncementButton announcement={announcement}/>
          <div className="border-t border-slate-50 my-1" />
          <DeleteData
            useMutation_hook={useDeleteAnnouncement}
            description="This action cannot be undone. This will permanently delete the announcement."
            id={announcement.announcement_id}
            resource_name="announcement"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
