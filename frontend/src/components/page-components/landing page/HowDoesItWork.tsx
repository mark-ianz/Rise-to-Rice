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
      className="flex-col bg-secondary-dark py-24 max-lg:py-20 max-md:py-16 overflow-hidden"
    >
      <div className="flex flex-col w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <div className="flex justify-between items-end mb-16 max-md:mb-12 max-md:flex-col max-md:items-start max-md:gap-4">
          <div>
            <span className="text-primary-main-light text-xs font-semibold uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="mt-2 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-white">
              {t("how_does_it_work.title")}
            </h2>
          </div>
          <p className="text-white/50 max-w-sm text-sm leading-relaxed max-md:max-w-none">
            From your recyclables to rice on your table - it only takes four simple steps.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-16 left-0 right-0 h-px bg-white/10 max-lg:hidden" />
          
          <ol className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 relative">
            {steps.map((step, index) => (
              <li
                key={index}
                className="group relative"
              >
                <div className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-white/10 rounded-xl p-3 group-hover:bg-primary-main/20 transition-colors">
                      <img
                        loading="lazy"
                        src={icons[index]}
                        alt={step.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-5xl font-bold text-white/10 group-hover:text-primary-main/30 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-16 w-6 h-6 text-white/20 max-lg:hidden" />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionWrapper>
  );
}
