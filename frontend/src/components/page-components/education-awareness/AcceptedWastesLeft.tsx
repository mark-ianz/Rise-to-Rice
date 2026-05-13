import plastics from "@/assets/plastics.webp";
import metal from "@/assets/metal.webp";
import glass from "@/assets/glass.webp";
import paper from "@/assets/paper.webp";
import { useTranslation } from "react-i18next";

export default function AcceptedWastesLeft() {
  const wasteImages = [plastics, metal, glass, paper];

  const { t } = useTranslation("education_and_awareness");

  return (
    <div className="flex flex-col gap-6 flex-1">
      <ul className="grid grid-cols-2 gap-4">
        {wasteImages.map((image, index) => (
          <li className="h-52 max-sm:h-40 overflow-hidden rounded-lg group" key={index}>
            <img
              loading="lazy"
              src={image}
              alt="waste"
              className="w-full h-full object-cover object-bottom rounded-lg transition-transform duration-500 group-hover:scale-105"
            />
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-4">
        <p className="leading-relaxed text-secondary-dark/80">{t("left.content_1")}</p>
        <p className="leading-relaxed text-secondary-dark/80">{t("left.content_2")}</p>
      </div>
    </div>
  );
}
