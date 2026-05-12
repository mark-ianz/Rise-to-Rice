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
    <li className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 w-full">
      <AnnouncementHeader announcement={announcement} />
      <AnnouncementContent viewing={viewing} announcement={announcement} />
      <ReactionCount announcement_id={announcement.announcement_id} />
      <hr />
      <AnnouncementFooter viewing={viewing} announcement={announcement} />
    </li>
  );
}
