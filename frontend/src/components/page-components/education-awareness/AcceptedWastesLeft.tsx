import { motion } from "framer-motion";
import plastics from "@/assets/plastics.webp";
import metal from "@/assets/metal.webp";
import glass from "@/assets/glass.webp";
import paper from "@/assets/paper.webp";
import { useTranslation } from "react-i18next";
import { Info, CheckCircle2, Lightbulb } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const imgVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function AcceptedWastesLeft() {
  const wasteImages = [plastics, metal, glass, paper];
  const { t } = useTranslation("education_and_awareness");
  const wasteLabels = t("categories", { returnObjects: true }) as string[];

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {wasteImages.map((image, index) => (
          <motion.div
            key={index}
            variants={imgVariants}
            className="group relative aspect-square rounded-[24px] overflow-hidden border border-warm-tan/30 shadow-md"
          >
            <img
              loading="lazy"
              src={image}
              alt={wasteLabels[index]}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/90 via-secondary-dark/20 to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4">
              <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">
                {wasteLabels[index]}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.div
          variants={cardVariants}
          className="flex gap-4 p-5 rounded-2xl bg-white border border-warm-tan/30 shadow-md hover:border-emerald-500/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-black text-secondary-dark mb-1 tracking-tight">{t("tips.clean_dry")}</h4>
            <p className="text-[11px] text-secondary-dark/50 leading-relaxed font-medium">
              {t("left.content_1")}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="flex gap-4 p-5 rounded-2xl bg-white border border-warm-tan/30 shadow-md hover:border-blue-500/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <Info size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-black text-secondary-dark mb-1 tracking-tight">{t("tips.sorting_matters")}</h4>
            <p className="text-[11px] text-secondary-dark/50 leading-relaxed font-medium">
              {t("left.content_2")}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="p-5 rounded-2xl bg-primary-main/10 border border-primary-main/20 flex gap-3 shadow-inner"
        >
          <Lightbulb size={16} className="text-primary-main shrink-0 mt-0.5 animate-pulse" />
          <p className="text-[11px] text-secondary-dark/70 leading-relaxed italic font-bold">
            {t("tips.quote")}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
