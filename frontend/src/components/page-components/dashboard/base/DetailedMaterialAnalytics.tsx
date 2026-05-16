import GenericError from "@/components/general/GenericError";
import SideKeyValuePairSkeleton from "@/components/skeletons/profile/SideKeyValuePairSkeleton";
import { useGetTopMatetial } from "@/hooks/query/useAnalytics";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TimeDisplay } from "@/types/time";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/lib/const";
import { Trophy, Medal, Award } from "lucide-react";

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
        "bg-white rounded-3xl p-8 max-md:p-6 border border-warm-tan/15 shadow-sm overflow-hidden relative",
        className
      )}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-main/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

      <div className="mb-10 flex items-start justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl max-md:text-xl font-black text-secondary-dark tracking-tight flex items-center gap-2">
            Detailed Analytics
          </h2>
          <p className="text-sm text-secondary-dark/50 mt-1 font-medium">
            A granular breakdown of every material you've recycled, ranked by impact.
          </p>
        </div>
        <div className="flex flex-col items-end max-md:hidden">
          <span className="text-[10px] font-bold text-secondary-dark/30 uppercase tracking-[0.2em]">Data Quality</span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mt-1">Verified Impact</span>
        </div>
      </div>

      <div className={cn("grid grid-cols-2 gap-x-16 gap-y-0 max-lg:grid-cols-1 max-lg:gap-x-0", listClassName)}>
        {/* Left column */}
        <div className="flex flex-col">
          {leftColumn.map((material, index) => (
            <MaterialRow
              key={index}
              rank={index + 1}
              name={material.material}
              weight={formatNumberWithCommasAndDecimals(material.total_weight)}
              percentage={material.weight_percentage}
              color={COLORS[index % COLORS.length]}
            />
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col">
          {rightColumn.map((material, index) => (
            <MaterialRow
              key={index + midpoint}
              rank={index + midpoint + 1}
              name={material.material}
              weight={formatNumberWithCommasAndDecimals(material.total_weight)}
              percentage={material.weight_percentage}
              color={COLORS[(index + midpoint) % COLORS.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MaterialRow({
  rank,
  name,
  weight,
  percentage,
  color,
}: {
  rank: number;
  name: string;
  weight: string;
  percentage: number;
  color: string;
}) {
  const getRankIcon = (r: number) => {
    if (r === 1) return <Trophy size={14} className="text-amber-500 fill-amber-500/10" />;
    if (r === 2) return <Medal size={14} className="text-slate-400 fill-slate-400/10" />;
    if (r === 3) return <Award size={14} className="text-amber-700 fill-amber-700/10" />;
    return <span className="text-[10px] font-bold text-secondary-dark/40">{r}</span>;
  };

  const isTopThree = rank <= 3;

  return (
    <div className="group py-5 border-b border-warm-tan/5 last:border-b-0 hover:bg-warm-cream/30 transition-all duration-300 px-3 -mx-3 rounded-xl">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
            isTopThree ? "bg-white border-warm-tan/20 shadow-sm" : "bg-warm-cream/50 border-transparent"
          )}>
            {getRankIcon(rank)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-secondary-dark truncate leading-none group-hover:text-primary-main transition-colors">
              {name}
            </span>
            <span className="text-[10px] font-bold text-secondary-dark/30 uppercase tracking-wider mt-1.5">Material Category</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-secondary-dark">
              {weight} <span className="text-[10px] text-secondary-dark/40 font-bold uppercase">kg</span>
            </span>
            <div className="flex items-center gap-1.5 bg-primary-main/5 border border-primary-main/10 px-2 py-0.5 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-main animate-pulse" />
              <span className="text-[10px] font-black text-primary-main">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-1.5 rounded-full bg-warm-tan/10 overflow-hidden">
        <div
          className="absolute h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(45,90,39,0.1)]"
          style={{
            width: `${Math.max(percentage, 1)}%`,
            backgroundColor: color,
            opacity: 0.85
          }}
        />
        {/* Track highlight on hover */}
        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
}
