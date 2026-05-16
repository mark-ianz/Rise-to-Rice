import GenericError from "@/components/general/GenericError";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/hooks/query/useMaterial";
import { useTranslation } from "react-i18next";
import { Coins, PackageCheck } from "lucide-react";
import { WeightUnit } from "./AcceptedWastes";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  unit: WeightUnit;
};

const KG_TO_LB = 2.20462;

export default function AcceptedWastesRight({ unit }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <List unit={unit} />
    </div>
  );
}

function List({ unit }: Props) {
  const { t } = useTranslation("education_and_awareness");
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    const dummyArray = Array.from({ length: 4 });

    return (
      <div className="space-y-4">
        {dummyArray.map((_, index) => (
          <div key={index} className="p-4 bg-white rounded-2xl border border-warm-tan/20">
            <Skeleton className="w-1/3 h-5" />
          </div>
        ))}
      </div>
    );
  }

  if (!categories) return <GenericError />;

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-warm-tan/30 rounded-3xl">
        <Coins size={40} className="text-warm-tan/20 mb-4" />
        <p className="text-sm font-bold text-secondary-dark/30">{t("right.no_items")}</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {categories.map((category, index) => (
        <AccordionItem 
          key={`category-${index}`} 
          value={`item-${index}`}
          className="group border border-warm-tan/30 rounded-3xl bg-white px-7 overflow-hidden transition-all duration-500 data-[state=open]:border-primary-main data-[state=open]:bg-primary-main/[0.03] data-[state=open]:shadow-[0_20px_50px_rgba(45,90,39,0.12)] border-b-transparent"
        >
          <AccordionTrigger className="hover:no-underline py-7 [&>svg]:hidden">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-5">
                {/* Icon Container with State-Based Styling */}
                <div className="w-12 h-12 rounded-2xl bg-warm-cream border border-warm-tan/10 flex items-center justify-center shrink-0 transition-all duration-500 group-data-[state=open]:bg-primary-main group-data-[state=open]:scale-110 group-data-[state=open]:shadow-[0_8px_20px_rgba(45,90,39,0.35)] group-data-[state=open]:border-primary-main">
                  <PackageCheck 
                    size={22} 
                    className="text-secondary-dark/30 group-data-[state=open]:text-white transition-colors duration-500" 
                  />
                </div>
                
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-black text-primary-main uppercase tracking-[0.25em] leading-none mb-2 opacity-50 group-data-[state=open]:opacity-100 transition-opacity">
                    Category {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lg font-black text-secondary-dark tracking-tight uppercase group-data-[state=open]:text-primary-main transition-colors duration-300">
                    {category.category}
                  </span>
                </div>
              </div>

              {/* Enhanced Arrow Indicator */}
              <div className="w-9 h-9 rounded-full bg-warm-tan/10 flex items-center justify-center group-data-[state=open]:bg-primary-main group-data-[state=open]:rotate-180 transition-all duration-500 shadow-sm group-data-[state=open]:shadow-md">
                <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M1 1L5 5L9 1" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-secondary-dark/40 group-data-[state=open]:text-white transition-colors"
                  />
                </svg>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-8 pt-0">
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 pt-4 border-t border-warm-tan/5">
              {category.types.map((material, materialIndex) => {
                const points = unit === "kg" 
                  ? material.points_per_kg 
                  : (material.points_per_kg / KG_TO_LB).toFixed(2);

                return (
                  <div 
                    key={materialIndex} 
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-warm-tan/10 hover:border-primary-main/40 hover:shadow-md transition-all duration-300 group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-warm-tan/20 group-hover/item:bg-primary-main group-hover/item:scale-125 transition-all" />
                      <span className="text-xs font-bold text-secondary-dark/70 group-hover/item:text-secondary-dark transition-colors">
                        {material.material}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-warm-cream/30 px-3 py-1.5 rounded-xl border border-warm-tan/10 shadow-sm group-hover/item:border-primary-main/20">
                      <span className="text-xs font-black text-primary-main tabular-nums">
                        {points}
                      </span>
                      <span className="text-[10px] font-bold text-secondary-dark/20 uppercase tracking-tighter">Pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
