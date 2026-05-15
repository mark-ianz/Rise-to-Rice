import { useNavigate } from "react-router-dom";
import SectionWrapper from "@/components/general/SectionWrapper";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import GetStartedButton from "./GetStartedButton";
import { ArrowRight, Leaf, Users, Recycle } from "lucide-react";
import heroImage1 from "@/assets/participating.webp";
import heroImage2 from "@/assets/weighing.webp";
import heroImage3 from "@/assets/reward.webp";

export default function HeroSection() {
  const { t } = useTranslation("landing_page");
  const navigate = useNavigate();

  return (
    <SectionWrapper
      id="hero-section"
      className="w-full bg-warm-cream relative overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 py-20 max-lg:py-16 max-md:py-12">
        <div className="grid grid-cols-2 gap-16 max-lg:gap-10 max-md:grid-cols-1 items-center">
          {/* Left: Content */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-main/10 text-primary-main text-xs font-semibold uppercase tracking-wider rounded-full w-fit mb-6">
              <Leaf className="w-3.5 h-3.5" />
              Barangay Bagong Silangan
            </div>
            
            <h1 className="text-5xl max-lg:text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-secondary-dark leading-[1.15] tracking-tight">
              {t("hero.title")}
            </h1>
            
            <p className="mt-6 text-secondary-dark/60 text-lg max-lg:text-base leading-relaxed">
              {t("hero.subtext")}
            </p>
            
            <div className="flex gap-3 mt-8 max-sm:flex-col">
              <GetStartedButton className="px-6 py-5 text-sm font-semibold" />
              <Button
                onClick={() => navigate("/#how-does-it-work")}
                className="px-6 py-5 text-sm font-semibold group bg-transparent border border-secondary-dark/20 text-secondary-dark hover:bg-secondary-dark hover:text-white hover:border-secondary-dark"
                variant="outline"
              >
                {t("hero.button.how_does_it_work")}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-warm-tan/50 max-sm:gap-4 max-sm:flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-main/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-main" />
                </div>
                <div>
                  <p className="text-2xl max-sm:text-xl font-bold text-secondary-dark">500+</p>
                  <p className="text-xs text-secondary-dark/50 uppercase tracking-wide">Households</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-main/10 flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-primary-main" />
                </div>
                <div>
                  <p className="text-2xl max-sm:text-xl font-bold text-secondary-dark">2,000kg</p>
                  <p className="text-xs text-secondary-dark/50 uppercase tracking-wide">Collected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bento Image Grid */}
          <div className="grid grid-cols-2 gap-6 max-md:hidden items-center">
            <div className="space-y-6">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-warm-beige shadow-2xl shadow-primary-main/10 animate-float border-4 border-white/50">
                <img 
                  src={heroImage1} 
                  alt="Community participating in recycling" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                />
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-warm-beige shadow-xl shadow-primary-main/10 animate-float-delayed border-4 border-white/50">
                <img 
                  src={heroImage2} 
                  alt="Weighing recyclables" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-warm-beige shadow-lg shadow-primary-main/10 animate-float-more-delayed border-4 border-white/50">
                <img 
                  src={heroImage3} 
                  alt="Receiving rewards" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
