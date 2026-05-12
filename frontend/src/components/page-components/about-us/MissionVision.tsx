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
      className="px-20 py-10 flex-col gap-10 bg-secondary-light/50 max-lg:px-10 max-sm:px-6 items-center justify-center"
    >
      <ul className="grid grid-cols-2 items-start min-h-full gap-8 max-sm:grid-cols-1 max-sm:gap-12">
        {content.map((item, index) => (
          <li
            key={index + item.title}
            className="flex gap-4 items-center flex-col max-w-[500px] justify-center max-sm:flex-col-reverse"
          >
            <ViewImage src={images[index]} alt={item.title}>
              <div className="h-96 w-full rounded-md max-sm:h-auto">
                <img
                  loading="lazy"
                  src={images[index]}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-md object-top"
                />
              </div>
            </ViewImage>

            <div className="flex flex-col gap-2 max-lg:text-sm">
              <HeaderText className="font-semibold">{item.title}</HeaderText>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
