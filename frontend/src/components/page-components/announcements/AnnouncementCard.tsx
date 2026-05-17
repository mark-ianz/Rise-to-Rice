import { Announcement } from "@/types/announcements";
import AnnouncementContent from "./AnnouncementContent";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementFooter from "./AnnouncementFooter";
import ReactionCount from "./reactions/ReactionCount";

type Props = {
  announcement: Announcement;
  viewing?: boolean;
};

export default function AnnouncementCard({ announcement, viewing }: Props) {
  return (
    <li className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(45,90,39,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5 w-full list-none">
      <AnnouncementHeader announcement={announcement} />
      <AnnouncementContent viewing={viewing} announcement={announcement} />
      
      {/* Footer Area: Reactions Count & Action Buttons */}
      <div className="flex flex-col gap-4 mt-2">
        <ReactionCount announcement_id={announcement.announcement_id} />
        <div className="border-t border-slate-100/80 w-full" />
        <AnnouncementFooter viewing={viewing} announcement={announcement} />
      </div>
    </li>
  );
}
