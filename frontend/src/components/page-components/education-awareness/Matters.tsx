import HeaderText from "@/components/general/HeaderText";
import { useTranslation } from "react-i18next";

type SegregatingHelps = {
  title: string;
  description: string;
}[];

export default function Matters() {
  const { t } = useTranslation("education_and_awareness");

  const segregating_helps = t("matters.list.items", {
    returnObjects: true,
  }) as SegregatingHelps;

  return (
    <div className="flex-1 flex flex-col gap-8 max-lg:gap-6">
      <div className="flex flex-col gap-4">
        <HeaderText className="text-primary-main text-2xl max-lg:text-xl">
          {t("matters.title")}
        </HeaderText>
        <p className="leading-relaxed text-secondary-dark/80">{t("matters.description")}</p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-medium text-secondary-dark">{t("matters.list.header")}</p>
        <ul className="flex flex-col gap-4">
          {segregating_helps.map((help, index) => (
            <li key={index} className="bg-white/60 p-4 rounded-lg">
              <p className="font-semibold text-primary-main">{help.title}</p>
              <p className="pl-4 mt-1 text-secondary-dark/80 leading-relaxed">{help.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
