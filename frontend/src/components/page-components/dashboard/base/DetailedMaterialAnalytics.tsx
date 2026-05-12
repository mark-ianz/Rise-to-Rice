import GenericError from "@/components/general/GenericError";
import SideKeyValuePairSkeleton from "@/components/skeletons/profile/SideKeyValuePairSkeleton";
import { useGetTopMatetial } from "@/hooks/query/useAnalytics";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TimeDisplay } from "@/types/time";
import { useTranslation } from "react-i18next";

type Props = {
  className?: string;
  time: TimeDisplay;
  user_id?: number | null | undefined;
  listClassName?: string;
};

export default function DetailedMaterialAnalytics({
  className,
  time,
  user_id,
  listClassName,
}: Props) {
  const { data: top_material, isLoading } = useGetTopMatetial({
    user_id,
    time: time,
  });

  const { t } = useTranslation("analytics");

  if (isLoading) return <SideKeyValuePairSkeleton />;

  if (!top_material) return <GenericError />;

  if (!top_material.length) return null;

  return (
    <div
      className={cn(
        "flex flex-col w-full items-center justify-center gap-2 max-lg:text-sm",
        className
      )}
    >
      <p className="text-md font-semibold text-md">
        {t("detailed_material_analytics")}:
      </p>
      <ol
        className={cn(
          "list-decimal grid gap-x-12",
          top_material.length > 3 ? "grid-cols-2" : "grid-cols-1",
          listClassName,
          "max-xsm:grid-cols-1"
        )}
      >
        {top_material.map((material, index) => (
          <li key={index}>
            <p>
              {`${material.material} - ${formatNumberWithCommasAndDecimals(
                material.total_weight
              )} KG `}{" "}
              <span className="italic text-tertiary">
                ({material.weight_percentage.toFixed(2)}%)
              </span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
