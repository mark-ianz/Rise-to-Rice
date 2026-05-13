import SectionWrapper from "@/components/general/SectionWrapper";
import segregate_icon from "@/assets/segregate-icon.png";
import exchange_icon from "@/assets/exchange-icon.png";
import redeem_points_icon from "@/assets/redeem-points-icon.png";
import recycle_icon from "@/assets/recycle-icon.png";
import { useTranslation } from "react-i18next";

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
      className="flex-col bg-white py-24 max-lg:py-20 max-md:py-16"
    >
      <div className="flex flex-col w-full max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6">
        <div className="text-center mb-16 max-md:mb-12">
          <span className="text-primary-main text-sm font-semibold uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-secondary-dark">
            {t("how_does_it_work.title")}
          </h2>
        </div>
        
        <ol className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-main text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>
                <div className="w-32 h-32 max-lg:w-28 max-lg:h-28 bg-warm-beige rounded-2xl p-5 transition-all duration-300 group-hover:bg-primary-main/10 group-hover:scale-105">
                  <img
                    loading="lazy"
                    src={icons[index]}
                    alt={step.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h3 className="text-lg max-lg:text-base font-semibold text-secondary-dark mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-secondary-dark/60 leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
}
