import SectionWrapper from "@/components/general/SectionWrapper";
import participating from "@/assets/participating.webp";
import reward from "@/assets/reward.webp";
import ViewImage from "@/components/general/ViewImage";
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
      className="py-24 max-lg:py-20 max-md:py-16 bg-white"
    >
      <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 w-full">
        <div className="text-center mb-16 max-md:mb-12">
          <span className="text-primary-main text-sm font-semibold uppercase tracking-wider">
            Our Purpose
          </span>
          <h2 className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-secondary-dark">
            Mission & Vision
          </h2>
        </div>
        
        <ul className="grid grid-cols-2 gap-8 max-lg:gap-6 max-sm:grid-cols-1">
          {content.map((item, index) => (
            <li
              key={index + item.title}
              className="flex flex-col bg-warm-beige rounded-2xl overflow-hidden group"
            >
              <ViewImage src={images[index]} alt={item.title}>
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    loading="lazy"
                    src={images[index]}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </ViewImage>

              <div className="flex flex-col gap-3 p-8 max-md:p-6">
                <h3 className="font-bold text-2xl max-lg:text-xl text-secondary-dark">{item.title}</h3>
                <p className="leading-relaxed text-secondary-dark/70">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
