import { motion } from "framer-motion";
import { format } from "date-fns";
import AcceptedWastesLeft from "@/components/page-components/education-awareness/AcceptedWastesLeft";
import AcceptedWastesRight from "@/components/page-components/education-awareness/AcceptedWastesRight";
import SectionWrapper from "@/components/general/SectionWrapper";
import { useTranslation } from "react-i18next";
import { Recycle, Info, MessageCircle, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type WeightUnit = "kg" | "lb";

export default function AcceptedWastes() {
  const { t } = useTranslation("education_and_awareness");
  const [unit, setUnit] = useState<WeightUnit>("kg");

  return (
    <SectionWrapper
      id="accepted-wastes"
      className="flex-col py-24 max-lg:py-20 max-md:py-16 bg-[#f7f5f2]" // Darker background for better contrast
    >
      <div className="w-full max-w-screen-xl mx-auto px-10 max-sm:px-6">
        <motion.div
          className="flex items-start justify-between mb-16 max-md:mb-10 max-lg:flex-col max-lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
        >
          <div className="max-w-2xl">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-main/10 border border-primary-main/20 text-primary-main text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <Recycle size={12} />
              <span>{t("accepted_wastes.badge")}</span>
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="text-4xl max-lg:text-3xl max-md:text-2xl font-black text-secondary-dark tracking-tight mb-3"
            >
              {t("accepted_wastes.title")}
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="text-sm text-secondary-dark/40 font-medium"
            >
              {t("accepted_wastes.subtitle")}
            </motion.p>
          </div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="flex flex-col items-end max-lg:items-start gap-4 shrink-0"
          >
            <div className="flex flex-col items-end max-lg:items-start gap-2">
              <span className="text-[10px] font-black text-secondary-dark/30 uppercase tracking-widest flex items-center gap-1.5">
                <Scale size={10} /> {t("accepted_wastes.measurement_unit")}
              </span>
              <Tabs 
                defaultValue="kg" 
                onValueChange={(v) => setUnit(v as WeightUnit)}
                className="bg-white/50 p-1 rounded-xl border border-warm-tan/20 shadow-sm"
              >
                <TabsList className="bg-transparent h-8">
                  <TabsTrigger value="kg" className="text-[10px] font-bold px-4 h-6 rounded-lg data-[state=active]:bg-primary-main data-[state=active]:text-white">KG</TabsTrigger>
                  <TabsTrigger value="lb" className="text-[10px] font-bold px-4 h-6 rounded-lg data-[state=active]:bg-primary-main data-[state=active]:text-white">LBS</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-warm-tan/30 shadow-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-secondary-dark/60 uppercase tracking-wider">
                {t("accepted_wastes.live_pricing", { date: format(new Date(), "MMM d, yyyy") })}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-12 gap-12 max-xl:gap-8 max-lg:grid-cols-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="col-span-5 max-lg:col-span-1"
          >
            <AcceptedWastesLeft />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="col-span-7 max-lg:col-span-1"
          >
            <div className="bg-warm-cream/40 rounded-[32px] p-8 max-md:p-6 border border-warm-tan/30 shadow-sm relative overflow-hidden">
               {/* Subtle background decoration */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-main/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-lg font-black text-secondary-dark tracking-tight uppercase">
                  {t("accepted_wastes.price_list")}
                </h3>
                <span className="text-[10px] font-bold text-primary-main bg-primary-main/10 border border-primary-main/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {t("accepted_wastes.points_per", { unit: unit.toUpperCase() })}
                </span>
              </div>
              
              <AcceptedWastesRight unit={unit} />

              <div className="mt-10 p-6 rounded-2xl bg-white border border-warm-tan/30 shadow-md relative z-10 transition-transform hover:translate-y-[-2px]">
                <div className="flex items-center gap-4 max-sm:flex-col max-sm:text-center">
                  <div className="w-10 h-10 rounded-xl bg-secondary-dark/5 flex items-center justify-center shrink-0 max-sm:self-center">
                    <MessageCircle size={20} className="text-secondary-dark/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-secondary-dark/60 leading-relaxed font-medium">
                      {t("accepted_wastes.inquire_text")}
                    </p>
                  </div>
                  <button className="text-xs font-black text-primary-main uppercase tracking-widest hover:underline px-4 py-2 bg-primary-main/5 rounded-lg border border-primary-main/10 w-full sm:w-auto">
                    {t("accepted_wastes.inquire_button")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
