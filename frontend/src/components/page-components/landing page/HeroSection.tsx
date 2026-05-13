import { useNavigate } from "react-router-dom";
import SectionWrapper from "@/components/general/SectionWrapper";
import { Button } from "@/components/ui/button";
import AreaCover from "@/components/general/AreaCover";
import { useTranslation } from "react-i18next";
import GetStartedButton from "./GetStartedButton";

export default function HeroSection() {
  const { t } = useTranslation("landing_page");
  const navigate = useNavigate();

  return (
    <SectionWrapper
      id="hero-section"
      className="px-20 w-full bg-no-repeat bg-cover bg-top bg-landingPage relative max-lg:px-10 max-sm:px-6 py-16 max-md:py-12"
    >
      <div className="flex flex-col max-w-screen-lg max-lg:max-w-screen-md z-40">
        <h1 className="text-7xl font-roboto font-bold text-primary-main max-lg:text-6xl max-md:text-4xl max-sm:text-3xl leading-tight text-balance">
          {t("hero.title")}
        </h1>
        <p className="my-8 text-secondary-dark text-lg leading-relaxed max-lg:text-base max-md:text-sm max-w-2xl">
          {t("hero.subtext")}
        </p>
        <div className="flex gap-4 max-sm:flex-col max-sm:gap-3">
          <GetStartedButton className="w-44 min-w-fit max-lg:w-36 max-lg:py-5 max-md:w-full max-md:py-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" />
          <Button
            onClick={() => navigate("/#how-does-it-work")}
            className="py-6 w-44 min-w-fit max-lg:w-36 max-lg:py-5 max-md:w-full max-md:py-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2"
            variant="outline"
          >
            <span className="max-lg:text-xs font-medium">
              {t("hero.button.how_does_it_work")}
            </span>
          </Button>
        </div>
      </div>
      <AreaCover />
    </SectionWrapper>
  );
}
