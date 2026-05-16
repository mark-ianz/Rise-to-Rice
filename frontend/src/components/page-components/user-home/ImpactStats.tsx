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
  Recycle,
  ArrowLeftRight,
  BarChart3,
  Leaf,
  Info,
} from "lucide-react";
import type { ReactNode } from "react";
import { TimeDisplay } from "@/types/time";
import SelectDropDown from "@/components/page-components/view_profile/SelectDropDown";
import { timeFilterItems } from "@/lib/const/filter_items";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function StatCard({
  icon,
  value,
  subtext,
  description,
}: {
  icon: ReactNode;
  value: string;
  subtext: string;
  description: string;
}) {
  return (
    <div className="bg-warm-cream rounded-xl p-5 border border-warm-tan/15 hover:shadow-md transition-all duration-200 flex flex-col gap-3 group relative">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary-main/10 flex items-center justify-center group-hover:bg-primary-main/20 transition-colors">
          {icon}
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="text-secondary-dark/40 hover:text-primary-main transition-colors p-1 rounded-full hover:bg-primary-main/5"
                aria-label="More information"
              >
                <Info size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-secondary-dark text-white border-none p-3 max-w-[220px] text-xs shadow-xl rounded-xl"
            >
              <p className="leading-relaxed">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        <p className="text-2xl max-lg:text-xl max-md:text-lg font-bold text-secondary-dark tracking-tight">
          {value}
        </p>
        <p className="text-xs text-secondary-dark/50 mt-0.5 uppercase tracking-wider font-semibold">
          {subtext}
        </p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-warm-cream rounded-xl p-5 border border-warm-tan/15">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-9 h-9 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-28 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export default function ImpactStats({ 
  time, 
  onTimeChange 
}: { 
  time: TimeDisplay;
  onTimeChange: (value: string | number) => void;
}) {
  const { state } = useUserContext();

  const { data: topMaterial, isLoading: topMaterialLoading } =
    useGetTopMatetial({
      user_id: state.user_id,
      time: time,
    });

  const { data: userAnalytics, isLoading: analyticsLoading } =
    useGetUserAnalytics({
      user_id: state.user_id,
      time: time,
    });

  const isLoading = topMaterialLoading || analyticsLoading;

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
    <div className="flex flex-col h-full">
      {/* Impact Header with Filter */}
      <div className="flex items-center justify-between mb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-secondary-dark tracking-tight">
            Recycling Impact Overview
          </h2>
          <p className="text-xs text-secondary-dark/50 mt-1">
            Track your environmental contribution for <span className="text-primary-main font-semibold">{time.label.toLowerCase()}</span>.
          </p>
        </div>
        <SelectDropDown
          onValueChange={onTimeChange}
          value={time.value}
          items={timeFilterItems}
          className="h-9 py-0 text-xs border-warm-tan/20 shadow-sm bg-white min-w-[120px]"
        >
          {time.label}
        </SelectDropDown>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 flex-1">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 flex-1">
          <StatCard
            icon={<Recycle size={20} className="text-primary-main" />}
            value={`${totalWeight} kg`}
            subtext="Weight Recycled"
            description="The total mass of waste you've successfully diverted from landfills through our program."
          />
          <StatCard
            icon={<ArrowLeftRight size={20} className="text-primary-main" />}
            value={`${totalExchanges} times`}
            subtext="Total Exchanges"
            description="Number of times you've visited a collection point to exchange waste for rewards."
          />
          <StatCard
            icon={<TrendingUp size={20} className="text-primary-main" />}
            value={`${totalPoints} points`}
            subtext="Points Earned"
            description="Total reward points accumulated based on the type and weight of materials recycled."
          />
          <StatCard
            icon={<Leaf size={20} className="text-primary-main" />}
            value={topMaterialName}
            subtext="Top Material"
            description="The waste category you recycle most frequently, showing your biggest impact area."
          />
        </div>
      )}
    </div>
  );
}
