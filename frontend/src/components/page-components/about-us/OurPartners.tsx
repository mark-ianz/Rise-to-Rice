import { motion } from "framer-motion";
import SectionWrapper from "@/components/general/SectionWrapper";
import { partners } from "@/lib/const/partners";
import { useTranslation } from "react-i18next";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function OurPartners() {
  const { t } = useTranslation("about_us");

  return (
    <SectionWrapper
      id="our-partners"
      className="py-24 max-lg:py-20 max-md:py-16 bg-secondary-dark"
    >
      <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 w-full">
        <motion.div
          className="text-center mb-16 max-md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
          }}
        >
          <motion.span
            variants={fadeUpVariants}
            className="text-primary-main-light text-sm font-semibold uppercase tracking-wider"
          >
            {t("partners.badge")}
          </motion.span>
          <motion.h2
            variants={fadeUpVariants}
            className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-white"
          >
            {t("partners.title")}
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            className="mt-4 text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            {t("partners.description")}
          </motion.p>
        </motion.div>

        <motion.ul
          className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
        >
          {partners.map((partner, index) => (
            <motion.li
              key={index + partner.name}
              variants={cardVariants}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-8 max-md:p-6 h-full"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center p-4 mb-4">
                  <img
                    loading="lazy"
                    src={partner.logo}
                    alt={`Logo of ${partner.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white">{partner.name}</p>
                  {partner.subtext && (
                    <p className="text-sm text-white/50 mt-1">
                      {partner.subtext}
                    </p>
                  )}
                </div>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </SectionWrapper>
  );
}
