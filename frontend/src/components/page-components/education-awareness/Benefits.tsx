import HeaderText from "@/components/general/HeaderText";
import { useTranslation } from "react-i18next";

type List = {
  title: string;
  description: string;
}[];

export default function Benefits() {
  const { t } = useTranslation("education_and_awareness");
  const benefits = t("benefits.list", {
    returnObjects: true,
  }) as List;

  return (
    <div className="flex-1 flex flex-col gap-8 max-lg:gap-6">
      <div className="flex flex-col gap-4">
        <HeaderText className="text-2xl max-lg:text-xl">{t("benefits.title")}</HeaderText>
        <p className="leading-relaxed text-secondary-dark/80">{t("benefits.description")}</p>
      </div>
      <ul className="flex flex-col gap-4">
        {benefits.map((benefit, index) => (
          <li key={index} className="bg-white/60 p-4 rounded-lg">
            <p className="font-semibold text-tertiary">{benefit.title}</p>
            <p className="pl-4 mt-1 text-secondary-dark/80 leading-relaxed">{benefit.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
