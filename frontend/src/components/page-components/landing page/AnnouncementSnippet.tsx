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
    <li className="flex flex-col rounded-lg bg-white border border-gray-100 min-h-52 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      {announcement.image_url && (
        <div className="w-full h-48 max-lg:h-40 overflow-hidden bg-secondary-light-2">
          <img
            loading="lazy"
            src={announcement.image_url}
            alt="Announcement Image"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 max-lg:p-4 flex flex-col text-sm max-lg:text-xs grow gap-3">
        <h3 className="font-bold text-base max-lg:text-sm line-clamp-2 text-secondary-dark">{announcement.title}</h3>
        {announcement.description && (
          <p className="text-gray-500 line-clamp-4 whitespace-pre-line leading-relaxed">
            {announcement.description}
          </p>
        )}
        <Link
          to={`/announcements/${announcement.announcement_id}`}
          className="flex items-center gap-1 ml-auto text-tertiary mt-auto font-medium hover:text-tertiary-dark transition-colors duration-200"
        >
          <span>{t("latest_announcements.read_more")}</span>
          <ChevronRightIcon size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </li>
  );
}
