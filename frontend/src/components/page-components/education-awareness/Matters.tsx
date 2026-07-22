import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Leaf, Droplets, TreePine, ShieldAlert } from "lucide-react";

type SegregatingHelps = {
  title: string;
  description: string;
}[];

const icons = [Leaf, Droplets, TreePine];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Matters() {
  const { t } = useTranslation("education_and_awareness");

  const segregating_helps = t("matters.list.items", {
    returnObjects: true,
  }) as SegregatingHelps;

  return (
    <div className="flex flex-col w-full">
      <motion.div
        className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 max-md:mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
        }}
      >
        <motion.div
          variants={fadeUpVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-main/10 border border-primary-main/20 text-primary-main text-[10px] font-black uppercase tracking-widest mb-6"
        >
          <ShieldAlert size={12} />
          <span>Why It Matters</span>
        </motion.div>
        
        <motion.h3
          variants={fadeUpVariants}
          className="text-5xl max-lg:text-4xl max-md:text-3xl font-black text-secondary-dark tracking-tight leading-tight mb-6"
        >
          {t("matters.title")}
        </motion.h3>
        
        <motion.p
          variants={fadeUpVariants}
          className="leading-relaxed text-secondary-dark/60 font-medium text-base max-md:text-sm"
        >
          {t("matters.description")}
        </motion.p>
      </motion.div>
      
      <motion.ul
        className="grid grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-1 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {segregating_helps.map((help, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.li
              key={index}
              variants={cardVariants}
              className="group flex flex-col items-center text-center bg-white p-8 rounded-[32px] border border-warm-tan/20 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary-main/30 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-warm-cream border border-warm-tan/10 flex items-center justify-center shrink-0 mb-6 group-hover:bg-primary-main group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(45,90,39,0.3)] transition-all duration-500">
                <Icon className="w-8 h-8 text-secondary-dark/40 group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <p className="font-black text-secondary-dark text-lg tracking-tight group-hover:text-primary-main transition-colors duration-300 mb-3">
                  {help.title}
                </p>
                <p className="text-secondary-dark/60 text-sm leading-relaxed font-medium">
                  {help.description}
                </p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
