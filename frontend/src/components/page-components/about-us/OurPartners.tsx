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
      className="bg-ourPartners items-start flex-col relative px-20 py-10 max-sm:px-10"
    >
      <div className="h-full grow w-full items-center flex flex-col justify-center z-40 gap-10">
        <div className="flex flex-col items-center max-w-[800px] text-center">
          <HeaderText className="text-secondary-light font-semibold">
            {i18n.language === "en" ? "Our Partners" : "Mga Kasosyo Namin"}
          </HeaderText>
          <p className="text-secondary-light-2 max-md:text-sm">
            {i18n.language === "en"
              ? "Our Solid Waste Management Program thrives through the support of our valued partners local government units, businesses, and environmental organizations working together to create a sustainable and waste-free community."
              : "Ang aming Solid Waste Management Program ay umuunlad sa pamamagitan ng suporta ng aming mga pinahahalagahang kasosyo na mga yunit ng lokal na pamahalaan, negosyo, at mga organisasyong pangkalikasan na nagtutulungan upang lumikha ng isang napapanatiling at walang basurang komunidad."}
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1 items-start">
          {partners.map((partner, index) => (
            <li
              key={index + partner.name}
              className="max-w-[300px] h-full rounded-lg bg-secondary-light flex flex-col items-center gap-4"
            >
              <a
                href={partner.url}
                target="_blank"
                className="h-full rounded-lg hover:bg-secondary-light-2 items-center flex flex-col p-8"
              >
                <div className="rounded-full items-center flex justify-center p-8">
                  <img
                    loading="lazy"
                    src={partner.logo}
                    alt={`Logo of ${partner.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-center">
                  {partner.name}{" "}
                  {partner.subtext && (
                    <span className="text-sm text-tertiary italic">
                      {partner.subtext}
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <AreaCover className="bg-tertiary/90" />
    </SectionWrapper>
  );
}
