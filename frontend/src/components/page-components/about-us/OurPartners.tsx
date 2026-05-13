import SectionWrapper from "@/components/general/SectionWrapper";
import AreaCover from "@/components/general/AreaCover";
import { partners } from "@/lib/const/partners";
import HeaderText from "@/components/general/HeaderText";
import { useTranslation } from "react-i18next";

export default function OurPartners() {
  const { i18n } = useTranslation();

  return (
    <SectionWrapper
      id="our-partners"
      className="bg-ourPartners items-start flex-col relative px-20 py-16 max-lg:px-10 max-sm:px-6 max-md:py-12"
    >
      <div className="h-full grow w-full items-center flex flex-col justify-center z-40 gap-12 max-md:gap-10">
        <div className="flex flex-col items-center max-w-[800px] text-center gap-4">
          <HeaderText className="text-secondary-light font-semibold text-4xl max-lg:text-3xl max-md:text-2xl">
            {i18n.language === "en" ? "Our Partners" : "Mga Kasosyo Namin"}
          </HeaderText>
          <p className="text-secondary-light-2/90 max-md:text-sm leading-relaxed">
            {i18n.language === "en"
              ? "Our Solid Waste Management Program thrives through the support of our valued partners local government units, businesses, and environmental organizations working together to create a sustainable and waste-free community."
              : "Ang aming Solid Waste Management Program ay umuunlad sa pamamagitan ng suporta ng aming mga pinahahalagahang kasosyo na mga yunit ng lokal na pamahalaan, negosyo, at mga organisasyong pangkalikasan na nagtutulungan upang lumikha ng isang napapanatiling at walang basurang komunidad."}
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 items-stretch">
          {partners.map((partner, index) => (
            <li
              key={index + partner.name}
              className="w-[280px] max-sm:w-full h-full rounded-xl bg-secondary-light flex flex-col items-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full rounded-xl hover:bg-secondary-light-2/50 items-center flex flex-col p-6 w-full transition-colors duration-300"
              >
                <div className="rounded-full items-center flex justify-center p-6 bg-white/50 mb-4">
                  <img
                    loading="lazy"
                    src={partner.logo}
                    alt={`Logo of ${partner.name}`}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-secondary-dark">{partner.name}</p>
                  {partner.subtext && (
                    <p className="text-sm text-tertiary italic mt-1">
                      {partner.subtext}
                    </p>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <AreaCover className="bg-tertiary/90" />
    </SectionWrapper>
  );
}
