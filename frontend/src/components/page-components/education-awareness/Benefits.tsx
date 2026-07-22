import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Gift, Coins, Users, HeartHandshake, BookOpen } from "lucide-react";

type List = {
  title: string;
  description: string;
}[];

const icons = [LeafIcon, Coins, Users, HeartHandshake, BookOpen];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function LeafIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export default function Benefits() {
  const { t } = useTranslation("education_and_awareness");
  const benefits = t("benefits.list", {
    returnObjects: true,
  }) as List;

  const renderCard = (benefit: List[0], index: number, isHero = false) => {
    const Icon = icons[index % icons.length];
    
    if (isHero) {
      return (
        <motion.div
          key={index}
          variants={cardVariants}
          className="col-span-2 max-lg:col-span-1 group flex max-md:flex-col items-center max-md:items-start gap-8 max-md:gap-5 bg-primary-main/5 p-10 max-md:p-8 rounded-[32px] border border-primary-main/20 shadow-sm hover:shadow-lg hover:border-primary-main/40 transition-all duration-500"
        >
          <div className="w-20 h-20 max-md:w-16 max-md:h-16 rounded-3xl bg-white border border-primary-main/20 flex items-center justify-center shrink-0 group-hover:bg-primary-main group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(45,90,39,0.3)] transition-all duration-500">
            <Icon className="w-10 h-10 max-md:w-8 max-md:h-8 text-primary-main group-hover:text-white transition-colors duration-500" />
          </div>
          <div>
            <p className="font-black text-secondary-dark text-2xl max-md:text-xl tracking-tight group-hover:text-primary-main transition-colors duration-300 mb-3">
              {benefit.title}
            </p>
            <p className="text-secondary-dark/70 text-base max-md:text-sm leading-relaxed font-medium max-w-2xl">
              {benefit.description}
            </p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={index}
        variants={cardVariants}
        className="col-span-1 group flex flex-col bg-white p-8 max-md:p-6 rounded-[32px] border border-warm-tan/20 shadow-sm hover:shadow-[0_15px_40px_rgba(45,90,39,0.08)] hover:-translate-y-1 hover:border-primary-main/30 transition-all duration-500"
      >
        <div className="w-14 h-14 rounded-2xl bg-warm-cream border border-warm-tan/10 flex items-center justify-center shrink-0 mb-6 group-hover:bg-primary-main group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(45,90,39,0.25)] transition-all duration-500">
          <Icon className="w-6 h-6 text-secondary-dark/40 group-hover:text-white transition-colors duration-500" />
        </div>
        <p className="font-black text-secondary-dark text-lg tracking-tight group-hover:text-primary-main transition-colors duration-300 mb-2">
          {benefit.title}
        </p>
        <p className="text-secondary-dark/60 text-sm leading-relaxed font-medium">
          {benefit.description}
        </p>
      </motion.div>
    );
  };

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
          <Gift size={12} />
          <span>Your Rewards</span>
        </motion.div>
        
        <motion.h3
          variants={fadeUpVariants}
          className="text-5xl max-lg:text-4xl max-md:text-3xl font-black text-secondary-dark tracking-tight leading-tight mb-6"
        >
          {t("benefits.title")}
        </motion.h3>
        
        <motion.p
          variants={fadeUpVariants}
          className="leading-relaxed text-secondary-dark/60 font-medium text-base max-md:text-sm"
        >
          {t("benefits.description")}
        </motion.p>
      </motion.div>
      
      <motion.div
        className="grid grid-cols-2 max-lg:grid-cols-1 gap-6 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {benefits.map((benefit, index) => {
          const isHero = index === 0;
          return renderCard(benefit, index, isHero);
        })}
      </motion.div>
    </div>
  );
}
