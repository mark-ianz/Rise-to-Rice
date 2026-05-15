import {
  useGetTopMatetial,
  useGetUserAnalytics,
} from "@/hooks/query/useAnalytics";
import useUserContext from "@/hooks/useUserContext";
import { getMaterialTotalWeight } from "@/utils/analytics";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Scale,
  Repeat,
  TrendingUp,
  Package,
} from "lucide-react";
import type { ReactNode } from "react";

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-warm-tan/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary-main/8 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-semibold text-secondary-dark/50 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl max-lg:text-xl max-md:text-lg font-bold text-secondary-dark tracking-tight">
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-secondary-dark/40 mt-0.5">{subtext}</p>
      )}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-warm-tan/20 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-16 mt-1.5" />
    </div>
  );
}

export default function ImpactStats() {
  const { state } = useUserContext();

  const timeDisplay = { value: "all_time" as const, label: "All-Time" };

  const { data: topMaterial, isLoading: topMaterialLoading } =
    useGetTopMatetial({
      user_id: state.user_id,
      time: timeDisplay,
    });

  const { data: userAnalytics, isLoading: analyticsLoading } =
    useGetUserAnalytics({
      user_id: state.user_id,
      time: timeDisplay,
    });

  const isLoading = topMaterialLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  const totalWeight = topMaterial
    ? Number(getMaterialTotalWeight(topMaterial)).toLocaleString()
    : "0";

  const totalExchanges = userAnalytics?.total_exchange_count || 0;
  const totalPoints = formatNumberWithCommasAndDecimals(
    userAnalytics?.total_points,
    0
  );
  const topMaterialName = topMaterial?.[0]?.material || "N/A";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-secondary-dark/70 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-main" />
          Your Impact
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard
          icon={<Scale size={18} className="text-primary-main" />}
          label="Recycled"
          value={`${totalWeight} kg`}
          subtext="Total weight"
        />
        <StatCard
          icon={<Repeat size={18} className="text-primary-main" />}
          label="Exchanges"
          value={totalExchanges.toString()}
          subtext={totalExchanges === 1 ? "time" : "times"}
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-primary-main" />}
          label="Points Earned"
          value={totalPoints}
          subtext="All-time"
        />
        <StatCard
          icon={<Package size={18} className="text-primary-main" />}
          label="Top Material"
          value={topMaterialName}
          subtext="Most recycled"
        />
      </div>
    </div>
  );
}
