import GenericError from "@/components/general/GenericError";
import HeaderText from "@/components/general/HeaderText";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/hooks/query/useMaterial";
import { useTranslation } from "react-i18next";

export default function AcceptedWastesRight() {
  const { t } = useTranslation("education_and_awareness");

  return (
    <div className="flex-1 flex flex-col gap-6 max-lg:gap-4">
      <HeaderText className="text-2xl max-lg:text-xl">
        {t("right.items_we_accept")}
      </HeaderText>
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
    <ul className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
      {categories.map((category, index) => (
        <li key={`accepted-wastes-${index}`} className="bg-white/60 p-4 rounded-lg">
          <p className="font-semibold text-primary-main mb-2">{category.category}</p>
          <ul className="list-disc pl-5 space-y-1">
            {category.types.map((material, materialIndex) => (
              <li key={materialIndex} className="text-secondary-dark/80">
                {material.material}{" "}
                <span className="text-xs text-tertiary font-medium">
                  ({material.points_per_kg} pts/kg)
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
