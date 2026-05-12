import GenericError from "@/components/general/GenericError";
import HeaderText from "@/components/general/HeaderText";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/hooks/query/useMaterial";
import { useTranslation } from "react-i18next";

export default function AcceptedWastesRight() {
  const { t } = useTranslation("education_and_awareness");

  return (
    <div className="flex-1 flex flex-col gap-4 max-lg:gap-2">
      <HeaderText className="text-2xl">
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
    <ul className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
      {categories.map((category, index) => (
        <li key={`accepted-wastes-${index}`} className="items-center">
          <p className="font-semibold">{category.category}</p>
          <ul className="list-disc pl-5">
            {category.types.map((material, index) => (
              <li key={index} className="">
                {material.material}{" "}
                <span className="text-sm text-tertiary">
                  ({material.points_per_kg} points/kg)
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
