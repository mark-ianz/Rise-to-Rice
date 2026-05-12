import plastics from "@/assets/plastics.webp";
import metal from "@/assets/metal.webp";
import glass from "@/assets/glass.webp";
import paper from "@/assets/paper.webp";
import { useTranslation } from "react-i18next";

export default function AcceptedWastesLeft() {
  const wasteImages = [plastics, metal, glass, paper];

  const { t } = useTranslation("education_and_awareness");

  return (
    <div className="flex flex-col gap-4 flex-1">
      <ul className="grid grid-cols-2 gap-4">
        {wasteImages.map((image, index) => (
          <li className="h-52 max-sm:h-auto" key={index}>
            <img
              loading="lazy"
              src={image}
              alt="waste"
              className="w-full h-full object-cover object-bottom rounded-md"
            />
          </li>
        ))}
      </ul>
      <span className="flex flex-col gap-4">
        <p>{t("left.content_1")}</p>
        <p>{t("left.content_2")}</p>
      </span>
    </div>
  );
}
