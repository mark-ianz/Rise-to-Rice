import { Announcement } from "@/types/announcements";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = {
  announcement: Announcement;
};

export default function AnnouncementSnippet({ announcement }: Props) {
  const { t } = useTranslation("landing_page");

  return (
    <li className="group">
      <Link
        to={`/announcements/${announcement.announcement_id}`}
        className="flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg h-full"
      >
        {announcement.image_url && (
          <div className="w-full aspect-[4/3] overflow-hidden bg-warm-cream">
            <img
              loading="lazy"
              src={announcement.image_url}
              alt="Announcement Image"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5 flex flex-col grow gap-3">
          <h3 className="font-semibold text-lg max-lg:text-base line-clamp-2 text-secondary-dark group-hover:text-primary-main transition-colors duration-200">
            {announcement.title}
          </h3>
          {announcement.description && (
            <p className="text-secondary-dark/60 text-sm line-clamp-3 leading-relaxed">
              {announcement.description}
            </p>
          )}
          <span className="flex items-center gap-1 text-primary-main text-sm font-medium mt-auto pt-2">
            {t("latest_announcements.read_more")}
            <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </li>
  );
}
