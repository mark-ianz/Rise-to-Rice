import SectionWrapper from "@/components/general/SectionWrapper";
import segregate_icon from "@/assets/segregate-icon.png";
import exchange_icon from "@/assets/exchange-icon.png";
import redeem_points_icon from "@/assets/redeem-points-icon.png";
import recycle_icon from "@/assets/recycle-icon.png";
import SectionHeader from "./SectionHeader";
import AreaCover from "@/components/general/AreaCover";
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
      className="items-start flex-col bg-howDoesItWork relative"
    >
      <div className="flex flex-col flex-1 w-full z-40">
        <SectionHeader>{t("how_does_it_work.title")}</SectionHeader>
        <ol className="py-20 flex justify-center w-full px-20 max-lg:px-10 max-sm:px-6 items-start flex-1 gap-12 max-lg:gap-8 flex-wrap">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex gap-5 flex-col items-center text-center w-[280px] max-lg:w-[240px] max-sm:w-full text-secondary-light group"
            >
              <div className="w-48 h-48 max-lg:w-40 max-lg:h-40 max-sm:w-36 max-sm:h-36 bg-secondary-light rounded-full p-5 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  loading="lazy"
                  src={icons[index]}
                  alt={step.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xl max-lg:text-lg max-sm:text-base font-semibold">
                  <span className="text-secondary-light-2">{index + 1}.</span> {step.title}
                </p>
                <p className="text-sm max-lg:text-xs leading-relaxed opacity-90">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <AreaCover className="bg-tertiary/90" />
    </SectionWrapper>
  );
}
