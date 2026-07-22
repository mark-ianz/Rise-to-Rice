import { motion } from "framer-motion";
import SectionWrapper from "@/components/general/SectionWrapper";
import about_us_1 from "@/assets/educating.webp";
import about_us_2 from "@/assets/educating_2.webp";
import about_us_3 from "@/assets/participating_2.webp";
import CompanyLogo from "@/components/logo/CompanyLogo";
import ViewImage from "@/components/general/ViewImage";
import { useTranslation } from "react-i18next";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function HeroSection() {
  const { t } = useTranslation("about_us");

  const about_us_images = [about_us_1, about_us_2, about_us_3];
  return (
    <SectionWrapper
      id="about-us"
      className="flex-col py-24 max-lg:py-20 max-md:py-16 bg-warm-cream"
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
            className="text-primary-main text-sm font-semibold uppercase tracking-wider"
          >
            About Us
          </motion.span>
          <motion.h1
            variants={fadeUpVariants}
            className="mt-3 text-5xl max-lg:text-4xl max-md:text-3xl font-bold text-secondary-dark"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={fadeUpVariants}
            className="mt-4 text-secondary-dark/60 italic text-lg max-md:text-base max-w-2xl mx-auto"
          >
            &ldquo;{t("hero.description")}&rdquo;
          </motion.p>
        </motion.div>

        <motion.ul
          className="w-full grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 mb-16 max-md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
        >
          {about_us_images.map((image, index) => (
            <motion.li
              key={index}
              variants={cardVariants}
              className="aspect-[4/3] rounded-2xl overflow-hidden max-lg:last:hidden group"
            >
              <ViewImage
                src={image}
                className="w-full h-full object-cover"
              >
                <img
                  loading="lazy"
                  src={image}
                  alt={`Image #${
                    index + 1
                  } of barangay workers doing their duty on rise to rice program`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </ViewImage>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="flex items-center gap-12 max-lg:gap-8 bg-white p-10 max-md:p-8 rounded-2xl border border-warm-tan/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl max-lg:text-xl font-bold text-secondary-dark">
              &ldquo;{t("hero.content.header")}&rdquo;
            </h2>
            <p className="text-secondary-dark/70 leading-relaxed">{t("hero.content.description")}</p>
          </div>
          <CompanyLogo containerClass="w-auto max-w-[120px] max-md:hidden flex-shrink-0" />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
