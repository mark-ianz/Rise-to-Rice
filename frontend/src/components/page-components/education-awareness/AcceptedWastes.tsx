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
        {/* Header Section */}
        <div className="flex items-start justify-between mb-16 max-md:mb-10 max-lg:flex-col max-lg:gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-main/10 border border-primary-main/20 text-primary-main text-[10px] font-black uppercase tracking-widest mb-4">
              <Recycle size={12} />
              <span>Material Guide</span>
            </div>
            <h2 className="text-4xl max-lg:text-3xl max-md:text-2xl font-black text-secondary-dark tracking-tight mb-3">
              {t("accepted_wastes.title")}
            </h2>
            <p className="text-sm text-secondary-dark/40 font-medium">
              Everything we accept at our facility, sorted by category and recycling value.
            </p>
          </div>
          
          <div className="flex flex-col items-end max-lg:items-start gap-4 shrink-0">
            {/* Unit Toggle */}
            <div className="flex flex-col items-end max-lg:items-start gap-2">
              <span className="text-[10px] font-black text-secondary-dark/30 uppercase tracking-widest flex items-center gap-1.5">
                <Scale size={10} /> Measurement Unit
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
                Live Pricing: {format(new Date(), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-12 max-xl:gap-8 max-lg:grid-cols-1">
          {/* Left Column: Visuals & Rules */}
          <div className="col-span-5 max-lg:col-span-1">
            <AcceptedWastesLeft />
          </div>

          {/* Right Column: Space-Saving Accordion */}
          <div className="col-span-7 max-lg:col-span-1">
            <div className="bg-warm-cream/40 rounded-[32px] p-8 max-md:p-6 border border-warm-tan/30 shadow-sm relative overflow-hidden">
               {/* Subtle background decoration */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-main/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-lg font-black text-secondary-dark tracking-tight uppercase">
                  Price List
                </h3>
                <span className="text-[10px] font-bold text-primary-main bg-primary-main/10 border border-primary-main/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  Points / {unit.toUpperCase()}
                </span>
              </div>
              
              <AcceptedWastesRight unit={unit} />

              <div className="mt-10 p-6 rounded-2xl bg-white border border-warm-tan/30 shadow-md relative z-10 transition-transform hover:translate-y-[-2px]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-dark/5 flex items-center justify-center shrink-0">
                    <MessageCircle size={20} className="text-secondary-dark/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-secondary-dark/60 leading-relaxed font-medium">
                      Missing a material? Reach out for custom pricing or bulk programs.
                    </p>
                  </div>
                  <button className="text-xs font-black text-primary-main uppercase tracking-widest hover:underline px-4 py-2 bg-primary-main/5 rounded-lg border border-primary-main/10">
                    Inquire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
