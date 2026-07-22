import { motion } from "framer-motion";
import SectionWrapper from "@/components/general/SectionWrapper";
import participating from "@/assets/participating.webp";
import reward from "@/assets/reward.webp";
import ViewImage from "@/components/general/ViewImage";
import { useTranslation } from "react-i18next";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

type ContentType = {
  title: string;
  description: string;
};

const images = [participating, reward];

export default function MissionVision() {
  const { t } = useTranslation("about_us");
  const content = t("mission_vision", { returnObjects: true }) as ContentType[];

  return (
    <SectionWrapper
      id="mission-vision"
      className="py-24 max-lg:py-20 max-md:py-16 bg-white"
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
            Our Purpose
          </motion.span>
          <motion.h2
            variants={fadeUpVariants}
            className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-secondary-dark"
          >
            Mission & Vision
          </motion.h2>
        </motion.div>

        <motion.ul
          className="grid grid-cols-2 gap-8 max-lg:gap-6 max-sm:grid-cols-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
          }}
        >
          {content.map((item, index) => (
            <motion.li
              key={index + item.title}
              variants={cardVariants}
              className="flex flex-col bg-warm-beige rounded-2xl overflow-hidden group"
            >
              <ViewImage src={images[index]} alt={item.title}>
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    loading="lazy"
                    src={images[index]}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </ViewImage>

              <div className="flex flex-col gap-3 p-8 max-md:p-6">
                <h3 className="font-bold text-2xl max-lg:text-xl text-secondary-dark">{item.title}</h3>
                <p className="leading-relaxed text-secondary-dark/70">{item.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </SectionWrapper>
  );
}
