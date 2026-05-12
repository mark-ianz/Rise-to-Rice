import HeaderText from "@/components/general/HeaderText";
import SectionWrapper from "@/components/general/SectionWrapper";
import about_us_1 from "@/assets/educating.webp";
import about_us_2 from "@/assets/educating_2.webp";
import about_us_3 from "@/assets/participating_2.webp";
import CompanyLogo from "@/components/logo/CompanyLogo";
import ViewImage from "@/components/general/ViewImage";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation("about_us");

  const about_us_images = [about_us_1, about_us_2, about_us_3];
  return (
    <SectionWrapper
      id="about-us"
      className="flex-col px-20 py-10 max-lg:px-10 max-sm:px-6"
    >
      <div className="flex flex-col gap-8 items-start justify-center h-full grow">
        <div className="flex flex-col items-start w-full">
          <HeaderText>{t("hero.title")}</HeaderText>
          <p className="text-tertiary italic max-md:text-sm">
            "{t("hero.description")}"
          </p>
        </div>
        <ul className="w-full grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {about_us_images.map((image, index) => (
            <li
              key={index}
              className="flex flex-col items-center gap-4 rounded-md max-lg:last:hidden max-sm:h-[250px]"
            >
              <ViewImage
                src={image}
                className="w-full h-full rounded-md object-cover"
              >
                <img
                  loading="lazy"
                  src={image}
                  alt={`Image #${
                    index + 1
                  } of barangay workers doing their duty on rise to rice program`}
                  className="w-full h-full rounded-md object-cover object-top"
                />
              </ViewImage>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-14 max-lg:gap-10">
          <span className="flex flex-col gap-2">
            <HeaderText>"{t("hero.content.header")}"</HeaderText>
            <p className="max-md:text-sm">{t("hero.content.description")}</p>
          </span>
          <CompanyLogo containerClass="w-auto max-w-[150px] max-md:hidden" />
        </div>
      </div>
    </SectionWrapper>
  );
}
