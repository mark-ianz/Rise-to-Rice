import GenericError from "@/components/general/GenericError";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/hooks/query/useMaterial";
import { useTranslation } from "react-i18next";

export default function AcceptedWastesRight() {
  const { t } = useTranslation("education_and_awareness");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-dark">
          {t("right.items_we_accept")}
        </h3>
        <span className="text-xs text-secondary-dark/50">Points per kilogram</span>
      </div>
      <List />
    </div>
  );
}

function List() {
  const { t } = useTranslation("education_and_awareness");

  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    const dummyArray = Array.from({ length: 6 });

    return (
      <ul className="grid grid-cols-3 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {dummyArray.map((_, index) => (
          <li key={`${index}-skeleton-accepted-wastes`} className="flex flex-col gap-2 p-4 bg-white rounded-xl">
            <Skeleton className="w-full max-w-24 h-5" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-full h-3 max-w-52" />
              <Skeleton className="w-full h-3 max-w-52" />
              <Skeleton className="w-full h-3 max-w-52" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (!categories) return <GenericError />;

  if (categories.length === 0) {
    return <p className="text-tertiary">{t("right.no_items")}</p>;
  }

  return (
    <ul className="grid grid-cols-3 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
      {categories.map((category, index) => (
        <li key={`accepted-wastes-${index}`} className="bg-white p-4 rounded-xl border border-warm-tan/20 hover:border-primary-main/30 hover:shadow-sm transition-all">
          <p className="font-semibold text-secondary-dark text-sm mb-3 pb-2 border-b border-warm-tan/20">{category.category}</p>
          <ul className="space-y-1.5">
            {category.types.map((material, materialIndex) => (
              <li key={materialIndex} className="flex items-center justify-between text-xs">
                <span className="text-secondary-dark/60">{material.material}</span>
                <span className="text-primary-main font-semibold tabular-nums">
                  {material.points_per_kg}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
