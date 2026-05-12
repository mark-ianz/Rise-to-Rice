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
        <ol className="py-20 flex justify-center w-full px-20 max-lg:px-10 max-sm:px-6 items-center flex-1 gap-20 flex-wrap">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex gap-4 flex-col items-center text-center w-[300px] text-secondary-light"
            >
              <div className="w-52 h-52 max-lg:w-44 max-lg:h-44 bg-secondary-light rounded-full p-4">
                <img
                  loading="lazy"
                  src={icons[index]}
                  alt={step.title}
                  className="w-full h-full"
                />
              </div>
              <p className="text-xl max-lg:text-lg">
                {index + 1 + ". " + step.title}
              </p>
              <p className="text-md max-lg:text-sm">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
      <AreaCover className="bg-tertiary/90" />
    </SectionWrapper>
  );
}
