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
    <div className="flex-1 flex flex-col gap-12 max-lg:gap-8">
      <div className="flex flex-col gap-12 max-lg:gap-8 max-md:gap-6 max-sm:gap-4">
        <HeaderText className="text-primary-main">
          {t("matters.title")}
        </HeaderText>
        <p>{t("matters.description")}</p>
      </div>
      <div className="flex flex-col gap-4">
        <p>{t("matters.list.header")}</p>
        <ul className="flex flex-col gap-4">
          {segregating_helps.map((help, index) => (
            <li key={index}>
              <p className="font-semibold">{help.title}</p>
              <p className="pl-5">{help.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
