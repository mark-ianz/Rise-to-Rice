import { useTranslation } from "react-i18next";
import { Gift, Coins, Users } from "lucide-react";

type List = {
  title: string;
  description: string;
}[];

const icons = [Gift, Coins, Users];

export default function Benefits() {
  const { t } = useTranslation("education_and_awareness");
  const benefits = t("benefits.list", {
    returnObjects: true,
  }) as List;

  return (
    <div className="flex flex-col bg-secondary-dark rounded-2xl p-8 max-md:p-6">
      <span className="text-primary-main-light text-xs font-semibold uppercase tracking-wider">
        Your Rewards
      </span>
      <h3 className="mt-2 text-2xl max-lg:text-xl font-bold text-white">
        {t("benefits.title")}
      </h3>
      <p className="mt-3 leading-relaxed text-white/50 text-sm">{t("benefits.description")}</p>
      
      <ul className="flex flex-col gap-3 mt-8">
        {benefits.map((benefit, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li key={index} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-primary-main/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-main-light" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{benefit.title}</p>
                <p className="mt-1 text-white/50 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
