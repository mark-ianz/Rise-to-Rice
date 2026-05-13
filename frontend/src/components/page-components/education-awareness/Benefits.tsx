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
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-primary-main text-sm font-semibold uppercase tracking-wider">
          Your Rewards
        </span>
        <h3 className="mt-2 text-3xl max-lg:text-2xl font-bold text-secondary-dark">
          {t("benefits.title")}
        </h3>
        <p className="mt-4 leading-relaxed text-secondary-dark/70">{t("benefits.description")}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="bg-white p-5 rounded-xl border border-warm-tan/30">
            <p className="font-semibold text-secondary-dark">{benefit.title}</p>
            <p className="mt-2 text-secondary-dark/60 text-sm leading-relaxed">{benefit.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
