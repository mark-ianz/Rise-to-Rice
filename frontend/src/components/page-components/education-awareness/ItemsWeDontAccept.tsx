import HeaderText from "@/components/general/HeaderText";
import { useTranslation } from "react-i18next";

type NotAcceptedMaterials = {
  material: string;
  description: string;
  examples: string[];
}[];

export default function ItemsWeDontAccept() {
  const { t } = useTranslation("education_and_awareness");

  const notAcceptedMaterials = t("right.items_we_do_not_accept.materials", {
    returnObjects: true,
  }) as NotAcceptedMaterials;

  return (
    <div>
      <HeaderText className="text-2xl mb-2">{t("right.items_we_do_not_accept.title")}</HeaderText>
      <ul className="list-disc flex flex-col gap-4">
        {notAcceptedMaterials.map((material, index) => (
          <li key={index} className="flex flex-col">
            <p className="font-semibold">{material.material}</p>
            <span className="pl-5">
              <p>{material.description}</p>
              <p className="italic text-tertiary text-sm">
                {" e.g "}(
                {material.examples.map((example, index) =>
                  index + 1 !== material.examples.length
                    ? `${example}, `
                    : example
                )}
                )
              </p>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
