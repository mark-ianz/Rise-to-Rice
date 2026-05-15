import SectionWrapper from "@/components/general/SectionWrapper";
import segregate_icon from "@/assets/segregate-icon.png";
import exchange_icon from "@/assets/exchange-icon.png";
import redeem_points_icon from "@/assets/redeem-points-icon.png";
import recycle_icon from "@/assets/recycle-icon.png";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

const icons = [segregate_icon, exchange_icon, redeem_points_icon, recycle_icon];

type Steps = {
  title: string;
  description: string;
}[];

export default function HowDoesItWork() {
  const { t } = useTranslation("landing_page");

  const steps = t("how_does_it_work.steps", {
    returnObjects: true,
  }) as Steps;

  return (
    <SectionWrapper
      id="how-does-it-work"
      className="flex-col bg-secondary-dark py-16 justify-center overflow-hidden"
    >
      <div className="flex flex-col w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <div className="flex flex-col mb-10 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-main/30 text-primary-main-light text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-4 border border-primary-main/20 w-fit">
            Process
          </div>
          <div className="flex justify-between items-end max-lg:flex-col max-lg:items-start max-lg:gap-4">
            <h2 className="text-5xl max-lg:text-4xl max-md:text-3xl font-bold text-white tracking-tight leading-none">
              How does it <span className="text-primary-main-light">work?</span>
            </h2>
            <p className="text-white/40 max-w-[340px] text-base leading-relaxed max-lg:max-w-none border-l-2 border-primary-main/20 pl-6">
              From your recyclables to rice on your table - it only takes four simple steps.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative glass-dark rounded-[2.5rem] p-8 flex gap-8 items-start hover:-translate-y-1.5 transition-all duration-500 hover:bg-white/[0.04]"
            >
              {/* Step Number Badge */}
              <div className="flex-shrink-0 relative">
                <div className="w-20 h-20 max-sm:w-16 max-sm:h-16 bg-white/5 rounded-[1.75rem] p-5 max-sm:p-4 border border-white/10 group-hover:bg-primary-main/30 group-hover:border-primary-main/50 transition-all duration-700 shadow-2xl">
                  <img
                    loading="lazy"
                    src={icons[index]}
                    alt={step.title}
                    className="w-full h-full object-contain brightness-110 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <span className="absolute -top-3 -right-3 w-10 h-10 max-sm:w-8 max-sm:h-8 bg-primary-main-light text-white rounded-xl flex items-center justify-center font-black text-lg max-sm:text-base shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col pt-1">
                <h3 className="text-2xl max-sm:text-xl font-bold text-white mb-2 group-hover:text-primary-main-light transition-colors tracking-tight">
                  {step.title}
                </h3>
                <p className="text-base max-sm:text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-all duration-500">
                  {step.description}
                </p>
              </div>

              {/* Decorative background element */}
              <div className="absolute bottom-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <ArrowRight className="w-24 h-24 -rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
