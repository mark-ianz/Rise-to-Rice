import { useTranslation } from "react-i18next";
import { Leaf, Droplets, TreePine } from "lucide-react";

type SegregatingHelps = {
  title: string;
  description: string;
}[];

const icons = [Leaf, Droplets, TreePine];

export default function Matters() {
  const { t } = useTranslation("education_and_awareness");

  const segregating_helps = t("matters.list.items", {
    returnObjects: true,
  }) as SegregatingHelps;

  return (
    <div className="flex flex-col">
      <span className="text-primary-main text-xs font-semibold uppercase tracking-wider">
        Why It Matters
      </span>
      <h3 className="mt-2 text-2xl max-lg:text-xl font-bold text-secondary-dark">
        {t("matters.title")}
      </h3>
      <p className="mt-3 leading-relaxed text-secondary-dark/60 text-sm">{t("matters.description")}</p>
      
      <p className="font-medium text-secondary-dark text-xs mt-8 mb-4 uppercase tracking-wider">{t("matters.list.header")}</p>
      <ul className="flex flex-col gap-3">
        {segregating_helps.map((help, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li key={index} className="flex gap-4 bg-white p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary-main/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-main" />
              </div>
              <div>
                <p className="font-semibold text-secondary-dark text-sm">{help.title}</p>
                <p className="mt-1 text-secondary-dark/50 text-sm leading-relaxed">{help.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
