import GenericError from "@/components/general/GenericError";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/hooks/query/useMaterial";
import { useTranslation } from "react-i18next";

export default function AcceptedWastesRight() {
  const { t } = useTranslation("education_and_awareness");

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-2xl max-lg:text-xl font-bold text-secondary-dark">
        {t("right.items_we_accept")}
      </h3>
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
      <ul className="grid grid-cols-2 gap-6">
        {dummyArray.map((_, index) => (
          <li key={`${index}-skeleton-accepted-wastes`} className="flex flex-col gap-2">
            <Skeleton className="w-full max-w-24 h-5" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-full h-3 max-w-52" />
              <Skeleton className="w-full h-3 max-w-52" />
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
    <ul className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
      {categories.map((category, index) => (
        <li key={`accepted-wastes-${index}`} className="bg-warm-beige p-5 rounded-xl">
          <p className="font-semibold text-secondary-dark mb-3">{category.category}</p>
          <ul className="space-y-2">
            {category.types.map((material, materialIndex) => (
              <li key={materialIndex} className="flex items-center justify-between text-sm">
                <span className="text-secondary-dark/70">{material.material}</span>
                <span className="text-primary-main font-medium text-xs bg-primary-main/10 px-2 py-1 rounded-full">
                  {material.points_per_kg} pts/kg
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
