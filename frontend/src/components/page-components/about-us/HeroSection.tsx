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
      className="flex-col px-20 py-14 max-lg:px-10 max-sm:px-6 max-md:py-10"
    >
      <div className="flex flex-col gap-10 max-md:gap-8 items-start justify-center h-full grow max-w-screen-xl w-full">
        <div className="flex flex-col items-start w-full gap-2">
          <HeaderText className="text-4xl max-lg:text-3xl max-md:text-2xl">{t("hero.title")}</HeaderText>
          <p className="text-tertiary italic max-md:text-sm text-lg max-lg:text-base">
            &ldquo;{t("hero.description")}&rdquo;
          </p>
        </div>
        <ul className="w-full grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {about_us_images.map((image, index) => (
            <li
              key={index}
              className="flex flex-col items-center gap-4 rounded-lg overflow-hidden max-lg:last:hidden max-sm:h-[280px] group"
            >
              <ViewImage
                src={image}
                className="w-full h-full rounded-lg object-cover"
              >
                <img
                  loading="lazy"
                  src={image}
                  alt={`Image #${
                    index + 1
                  } of barangay workers doing their duty on rise to rice program`}
                  className="w-full h-full rounded-lg object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </ViewImage>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-14 max-lg:gap-10 bg-white/50 p-8 max-md:p-6 rounded-xl w-full">
          <div className="flex flex-col gap-3">
            <HeaderText className="text-2xl max-lg:text-xl max-md:text-lg">&ldquo;{t("hero.content.header")}&rdquo;</HeaderText>
            <p className="max-md:text-sm leading-relaxed text-secondary-dark/80">{t("hero.content.description")}</p>
          </div>
          <CompanyLogo containerClass="w-auto max-w-[150px] max-md:hidden flex-shrink-0" />
        </div>
      </div>
    </SectionWrapper>
  );
}
