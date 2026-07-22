import { motion } from "framer-motion";
import { Announcement } from "@/types/announcements";
import { ArrowUpRight, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getAnnouncementUrl } from "@/utils/url";

type Props = {
  announcement: Announcement;
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function AnnouncementSnippet({ announcement }: Props) {
  const { t } = useTranslation("landing_page");

  return (
    <motion.li className="group" variants={cardVariants}>
      <Link
        to={getAnnouncementUrl(announcement)}
        className="flex flex-col bg-warm-beige/50 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-warm-beige h-full border border-transparent hover:border-warm-tan/30"
      >
        {announcement.image_url && (
          <div className="w-full aspect-video overflow-hidden">
            <img
              loading="lazy"
              src={announcement.image_url}
              alt="Announcement Image"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5 flex flex-col grow gap-2">
          {announcement.createdAt && (
            <span className="flex items-center gap-1.5 text-secondary-dark/40 text-xs">
              <Calendar size={12} />
              {format(new Date(announcement.createdAt), "MMM d, yyyy")}
            </span>
          )}
          <h3 className="font-semibold text-base line-clamp-2 text-secondary-dark group-hover:text-primary-main transition-colors duration-200">
            {announcement.title}
          </h3>
          {announcement.description && (
            <p className="text-secondary-dark/50 text-sm line-clamp-2 leading-relaxed">
              {announcement.description}
            </p>
          )}
          <span className="flex items-center gap-1 text-primary-main text-sm font-medium mt-auto pt-3">
            {t("latest_announcements.read_more")}
            <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}
