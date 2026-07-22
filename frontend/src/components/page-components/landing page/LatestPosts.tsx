import { motion } from "framer-motion";
import SectionWrapper from "@/components/general/SectionWrapper";
import AnnouncementSnippet from "./AnnouncementSnippet";
import { ArrowRight, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetRecentAnnouncements } from "@/hooks/query/useAnnouncement";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function LatestPosts() {
  const { t } = useTranslation("landing_page");
  const { data } = useGetRecentAnnouncements();

  const recent_announcements = data?.result;
  const hasRecentAnnouncements =
    recent_announcements && recent_announcements?.length > 0 ? true : false;

  return (
    <SectionWrapper
      id="latest-posts"
      className="flex-col py-24 max-lg:py-20 max-md:py-16 bg-white"
    >
      <div className="w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <motion.div
          className="flex justify-between items-end mb-12 max-md:mb-8 max-sm:flex-col max-sm:items-start max-sm:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              variants={fadeUpVariants}
              className="w-12 h-12 rounded-2xl bg-primary-main/10 flex items-center justify-center flex-shrink-0"
            >
              <Bell className="w-6 h-6 text-primary-main" />
            </motion.div>
            <div>
              <motion.h2
                variants={fadeUpVariants}
                className="text-3xl max-lg:text-2xl max-md:text-xl font-bold text-secondary-dark"
              >
                {t("latest_announcements.title")}
              </motion.h2>
              <motion.p
                variants={fadeUpVariants}
                className="text-secondary-dark/50 text-sm mt-1"
              >
                {t("latest_announcements.subtitle")}
              </motion.p>
            </div>
          </div>
          <motion.div variants={fadeUpVariants}>
            <Link
              to={"/announcements"}
              className="inline-flex items-center gap-2 text-primary-main font-medium text-sm hover:underline group"
            >
              {t("latest_announcements.view_more")} 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
        
        {hasRecentAnnouncements ? (
          <motion.ol
            className="grid grid-cols-3 gap-6 w-full max-lg:grid-cols-2 max-sm:grid-cols-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {recent_announcements?.slice(0, 3).map((post, index) => (
              <AnnouncementSnippet
                key={index + post.title}
                announcement={post}
              />
            ))}
          </motion.ol>
        ) : (
          <motion.div
            className="text-center py-16 bg-warm-beige/50 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <Bell className="w-10 h-10 text-secondary-dark/20 mx-auto mb-3" />
            <p className="text-secondary-dark/50">
              {t("latest_announcements.no_recent_announcements")}
            </p>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
}
