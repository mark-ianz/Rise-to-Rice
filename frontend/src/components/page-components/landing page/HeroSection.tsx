import { useNavigate } from "react-router-dom";
import SectionWrapper from "@/components/general/SectionWrapper";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import GetStartedButton from "./GetStartedButton";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation("landing_page");
  const navigate = useNavigate();

  return (
    <SectionWrapper
      id="hero-section"
      className="px-20 w-full bg-warm-cream relative max-lg:px-10 max-sm:px-6 py-24 max-lg:py-20 max-md:py-16 min-h-[85vh] flex items-center"
    >
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto z-40">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-main/10 text-primary-main text-sm font-medium rounded-full mb-8 max-md:mb-6">
          <span className="w-2 h-2 bg-primary-main rounded-full animate-pulse" />
          Solid Waste Management Program
        </span>
        <h1 className="text-6xl max-lg:text-5xl max-md:text-4xl max-sm:text-3xl font-bold text-secondary-dark leading-[1.1] tracking-tight text-balance">
          {t("hero.title")}
        </h1>
        <p className="mt-8 mb-10 text-secondary-dark/70 text-xl max-lg:text-lg max-md:text-base leading-relaxed max-w-2xl">
          {t("hero.subtext")}
        </p>
        <div className="flex gap-4 max-sm:flex-col max-sm:gap-3 max-sm:w-full">
          <GetStartedButton className="px-8 py-6 text-base font-medium max-sm:w-full" />
          <Button
            onClick={() => navigate("/#how-does-it-work")}
            className="px-8 py-6 text-base font-medium max-sm:w-full group bg-transparent border-2 border-secondary-dark/20 text-secondary-dark hover:bg-secondary-dark hover:text-white"
            variant="outline"
          >
            {t("hero.button.how_does_it_work")}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-main/5 rounded-full blur-3xl max-lg:hidden" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-main/5 rounded-full blur-3xl max-lg:hidden" />
    </SectionWrapper>
  );
}
