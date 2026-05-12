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
    <div className="flex-1 flex flex-col gap-12 max-lg:gap-8 max-md:gap-6 max-sm:gap-4">
      <HeaderText>{t("benefits.title")}</HeaderText>
      <p>{t("benefits.description")}</p>
      <ul className="flex flex-col gap-4">
        {benefits.map((benefit, index) => (
          <li key={index}>
            <p className="font-semibold">{benefit.title}</p>
            <p className="pl-5">{benefit.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
