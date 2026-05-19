import DateDifference from "@/components/general/DateDifference";
import { Announcement } from "@/types/announcements";
import { displayFullName } from "@/lib/format";
import {
  useDeleteAnnouncement,
  useGetAuthor,
} from "@/hooks/query/useAnnouncement";
import { Button } from "@/components/ui/button";
import { Ellipsis, Clock, ShieldAlert, Pencil, Trash2, BookOpen } from "lucide-react";
import { calculateReadingTime } from "@/utils/text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteData from "../dashboard/DeleteData";
import EditAnnouncementButton from "./EditAnnouncementButton";
import companyLogo from "@/assets/COMPONY LOGO NO BG.png";
import useUserContext from "@/hooks/useUserContext";

type Props = {
  announcement: Announcement;
};

export default function AnnouncementHeader({ announcement }: Props) {
  const { data: author } = useGetAuthor(announcement.announcement_id);
  const { state: user } = useUserContext();
  const isAdmin = user?.isAdmin;

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
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight hover:text-emerald-700 transition-colors">
              {author ? displayFullName(author) : "Deleted User"}
            </h3>
            {(author?.role === "admin" || author?.role === "super_admin") && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Admin
              </span>
            )}
          </span>
          <span className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium flex-wrap animate-fadeIn">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <DateDifference className="text-slate-400 font-medium hover:text-emerald-600 hover:no-underline transition-colors" date={announcement.createdAt} />
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{calculateReadingTime(announcement.description)}</span>
            </span>
          </span>
        </div>
      </div>

      {/* Popover actions for Admins / Authorized users */}
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
  );
}
