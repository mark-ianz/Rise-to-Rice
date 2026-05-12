import { Announcement } from "@/types/announcements";
import { ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = {
  announcement: Announcement;
};

export default function AnnouncementSnippet({ announcement }: Props) {
  const { t } = useTranslation("landing_page");

  return (
    <li className="flex flex-col shadow-lg rounded-md bg-white border min-h-52">
      {announcement.image_url && (
        <div className="w-full h-48 max-lg:h-40 rounded-t-md overflow-hidden bg-secondary-light-2">
          <img
            loading="lazy"
            src={announcement.image_url}
            alt="Announcement Image"
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="p-4 flex flex-col text-sm max-lg:text-xs grow gap-2">
        <p className="font-bold text-md line-clamp-2">{announcement.title}</p>
        {announcement.description && (
          <p className="mt-2 text-gray-500 line-clamp-5 whitespace-pre-line">
            {announcement.description}
          </p>
        )}
        <Link
          to={`/announcements/${announcement.announcement_id}`}
          className="flex items-center gap-1 ml-auto text-tertiary mt-auto"
        >
          <p>{t("latest_announcements.read_more")}</p>
          <ChevronRightIcon size={18} />
        </Link>
      </div>
    </li>
  );
}
