import { useTranslation } from "react-i18next";
import { Leaf, Droplets, TreePine, ShieldAlert } from "lucide-react";

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
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 max-md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-main/10 border border-primary-main/20 text-primary-main text-[10px] font-black uppercase tracking-widest mb-6">
          <ShieldAlert size={12} />
          <span>Why It Matters</span>
        </div>
        
        <h3 className="text-5xl max-lg:text-4xl max-md:text-3xl font-black text-secondary-dark tracking-tight leading-tight mb-6">
          {t("matters.title")}
        </h3>
        
        <p className="leading-relaxed text-secondary-dark/60 font-medium text-base max-md:text-sm">
          {t("matters.description")}
        </p>
      </div>
      
      {/* 3-Column Grid for Items */}
      <ul className="grid grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-1 gap-6">
        {segregating_helps.map((help, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li 
              key={index} 
              className="group flex flex-col items-center text-center bg-white p-8 rounded-[32px] border border-warm-tan/20 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary-main/30 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-warm-cream border border-warm-tan/10 flex items-center justify-center shrink-0 mb-6 group-hover:bg-primary-main group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(45,90,39,0.3)] transition-all duration-500">
                <Icon className="w-8 h-8 text-secondary-dark/40 group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <p className="font-black text-secondary-dark text-lg tracking-tight group-hover:text-primary-main transition-colors duration-300 mb-3">
                  {help.title}
                </p>
                <p className="text-secondary-dark/60 text-sm leading-relaxed font-medium">
                  {help.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
