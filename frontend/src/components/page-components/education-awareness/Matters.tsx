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
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-primary-main text-sm font-semibold uppercase tracking-wider">
          Why It Matters
        </span>
        <h3 className="mt-2 text-3xl max-lg:text-2xl font-bold text-secondary-dark">
          {t("matters.title")}
        </h3>
        <p className="mt-4 leading-relaxed text-secondary-dark/70">{t("matters.description")}</p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-medium text-secondary-dark text-sm">{t("matters.list.header")}</p>
        <ul className="flex flex-col gap-3">
          {segregating_helps.map((help, index) => (
            <li key={index} className="bg-white p-5 rounded-xl border border-warm-tan/30">
              <p className="font-semibold text-secondary-dark">{help.title}</p>
              <p className="mt-2 text-secondary-dark/60 text-sm leading-relaxed">{help.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
