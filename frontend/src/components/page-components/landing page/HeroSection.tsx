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
      className="px-20 w-full bg-no-repeat bg-cover bg-top bg-landingPage relative max-lg:px-10 max-sm:px-6 py-10"
    >
      <div className="flex flex-col max-w-screen-lg max-lg:max-w-screen-md z-40">
        <h1 className="text-7xl font-roboto font-bold text-primary-main max-lg:text-6xl max-md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="my-6 text-secondary-dark text-lg leading-6 max-lg:text-md max-md:text-sm">
          {t("hero.subtext")}
        </p>
        <div className="flex gap-3">
          <GetStartedButton className="w-40 min-w-fit max-lg:w-32 max-lg:py-5 max-md:w-28 max-md:py-4" />
          <Button
            onClick={() => navigate("/#how-does-it-work")}
            className="py-6 w-40 min-w-fit max-lg:w-32 max-lg:py-5 max-md:w-28 max-md:py-4"
            variant="outline"
          >
            <p className="max-lg:text-xs">
              {t("hero.button.how_does_it_work")}
            </p>
          </Button>
        </div>
      </div>
      <AreaCover />
    </SectionWrapper>
  );
}
