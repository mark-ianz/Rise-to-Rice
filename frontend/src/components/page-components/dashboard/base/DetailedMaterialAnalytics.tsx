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

  // Split materials into two columns for the grid
  const midpoint = Math.ceil(top_material.length / 2);
  const leftColumn = top_material.slice(0, midpoint);
  const rightColumn = top_material.slice(midpoint);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 max-md:p-4 border border-warm-tan/15 shadow-sm",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="text-xl max-md:text-lg font-bold text-secondary-dark tracking-tight">
          {t("detailed_material_analytics")}
        </h2>
        <p className="text-sm text-secondary-dark/50 mt-1">
          A granular breakdown of every material you've recycled, including weights and impact percentages.
        </p>
      </div>

      <div className={cn("grid grid-cols-2 gap-x-12 gap-y-0 max-sm:grid-cols-1", listClassName)}>
        {/* Left column */}
        <div className="flex flex-col">
          {leftColumn.map((material, index) => (
            <MaterialRow
              key={index}
              name={material.material}
              weight={formatNumberWithCommasAndDecimals(material.total_weight)}
              percentage={material.weight_percentage}
            />
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col">
          {rightColumn.map((material, index) => (
            <MaterialRow
              key={index + midpoint}
              name={material.material}
              weight={formatNumberWithCommasAndDecimals(material.total_weight)}
              percentage={material.weight_percentage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MaterialRow({
  name,
  weight,
  percentage,
}: {
  name: string;
  weight: string;
  percentage: number;
}) {
  return (
    <div className="py-4 border-b border-warm-tan/10 last:border-b-0 hover:bg-warm-cream/50 transition-colors px-1 -mx-1 rounded-lg">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-secondary-dark truncate">
          {name}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-bold text-primary-main">
            {weight} KG
          </span>
          <span className="text-[10px] font-bold bg-primary-main/10 text-primary-main px-2 py-0.5 rounded-full">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-warm-tan/15 overflow-hidden">
        <div
          className="h-full bg-primary-main rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(45,90,39,0.2)]"
          style={{
            width: `${Math.max(percentage, 2)}%`,
          }}
        />
      </div>
    </div>
  );
}
