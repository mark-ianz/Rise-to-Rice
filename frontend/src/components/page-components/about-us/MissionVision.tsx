import SectionWrapper from "@/components/general/SectionWrapper";
import participating from "@/assets/participating.webp";
import reward from "@/assets/reward.webp";
import ViewImage from "@/components/general/ViewImage";
import HeaderText from "@/components/general/HeaderText";
import { useTranslation } from "react-i18next";

type ContentType = {
  title: string;
  description: string;
};

const images = [participating, reward];

export default function MissionVision() {
  const { t } = useTranslation("about_us");
  const content = t("mission_vision", { returnObjects: true }) as ContentType[];

  return (
    <SectionWrapper
      id="mission-vision"
      className="px-20 py-16 flex-col gap-10 bg-secondary-light/50 max-lg:px-10 max-sm:px-6 max-md:py-12 items-center justify-center"
    >
      <ul className="grid grid-cols-2 items-stretch min-h-full gap-10 max-lg:gap-8 max-sm:grid-cols-1 max-sm:gap-12 max-w-screen-xl w-full">
        {content.map((item, index) => (
          <li
            key={index + item.title}
            className="flex gap-6 items-center flex-col max-w-[550px] justify-start max-sm:flex-col-reverse bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <ViewImage src={images[index]} alt={item.title}>
              <div className="h-80 max-lg:h-64 w-full max-sm:h-auto overflow-hidden">
                <img
                  loading="lazy"
                  src={images[index]}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />
              </div>
            </ViewImage>

            <div className="flex flex-col gap-3 max-lg:text-sm p-6 pt-0 max-sm:pt-6 max-sm:pb-0">
              <HeaderText className="font-semibold text-2xl max-lg:text-xl">{item.title}</HeaderText>
              <p className="leading-relaxed text-secondary-dark/80">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
