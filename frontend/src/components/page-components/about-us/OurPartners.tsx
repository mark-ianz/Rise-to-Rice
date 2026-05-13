import SectionWrapper from "@/components/general/SectionWrapper";
import { partners } from "@/lib/const/partners";
import { useTranslation } from "react-i18next";

export default function OurPartners() {
  const { i18n } = useTranslation();

  return (
    <SectionWrapper
      id="our-partners"
      className="py-24 max-lg:py-20 max-md:py-16 bg-secondary-dark"
    >
      <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 w-full">
        <div className="text-center mb-16 max-md:mb-12">
          <span className="text-primary-main-light text-sm font-semibold uppercase tracking-wider">
            Working Together
          </span>
          <h2 className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-white">
            {i18n.language === "en" ? "Our Partners" : "Mga Kasosyo Namin"}
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto leading-relaxed">
            {i18n.language === "en"
              ? "Our Solid Waste Management Program thrives through the support of our valued partners working together to create a sustainable community."
              : "Ang aming Solid Waste Management Program ay umuunlad sa pamamagitan ng suporta ng aming mga pinahahalagahang kasosyo na nagtutulungan upang lumikha ng isang napapanatiling komunidad."}
          </p>
        </div>
        
        <ul className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {partners.map((partner, index) => (
            <li
              key={index + partner.name}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-8 max-md:p-6 h-full"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center p-4 mb-4">
                  <img
                    loading="lazy"
                    src={partner.logo}
                    alt={`Logo of ${partner.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white">{partner.name}</p>
                  {partner.subtext && (
                    <p className="text-sm text-white/50 mt-1">
                      {partner.subtext}
                    </p>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
