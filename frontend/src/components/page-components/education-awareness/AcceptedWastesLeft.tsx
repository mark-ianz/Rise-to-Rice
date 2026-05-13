import plastics from "@/assets/plastics.webp";
import metal from "@/assets/metal.webp";
import glass from "@/assets/glass.webp";
import paper from "@/assets/paper.webp";
import { useTranslation } from "react-i18next";

const wasteLabels = ["Plastics", "Metal", "Glass", "Paper"];

export default function AcceptedWastesLeft() {
  const wasteImages = [plastics, metal, glass, paper];

  const { t } = useTranslation("education_and_awareness");

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-2 gap-4">
        {wasteImages.map((image, index) => (
          <li className="relative aspect-square overflow-hidden rounded-2xl group" key={index}>
            <img
              loading="lazy"
              src={image}
              alt={wasteLabels[index]}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-medium text-sm">
              {wasteLabels[index]}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-4 text-secondary-dark/70 leading-relaxed">
        <p>{t("left.content_1")}</p>
        <p>{t("left.content_2")}</p>
      </div>
    </div>
  );
}
