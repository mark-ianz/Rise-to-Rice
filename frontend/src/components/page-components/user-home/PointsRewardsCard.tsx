import { Points as PointsType } from "@/types/points";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Coins, Recycle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import useUserContext from "@/hooks/useUserContext";
import { useGetUserActivity } from "@/hooks/query/useUserActivity";
import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart } from "@/lib/format";
import { useTranslation } from "react-i18next";

export default function PointsRewardsCard() {
  const { t } = useTranslation("user_home");
  const { state } = useUserContext();

  const { data: points, isLoading: pointsLoading } = useQuery({
    queryKey: ["user-points"],
    queryFn: async () => {
      const response = await axios.get<PointsType>("/api/points/");
      return response.data;
    },
  });

  const { data: activityHistory, isLoading: historyLoading } =
    useGetUserActivity({
      userId: state?.user_id,
      limit: 3,
      page: 1,
    });

  const recentActivities = activityHistory?.result || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-tan/15 overflow-hidden h-full flex flex-col">
      {/* Points Header - Balanced Sage-Green Theme */}
      <div className="relative bg-gradient-to-br from-[#E8F4E5] to-[#D5ECD0]/70 p-6 border-b border-[#2D5A27]/15 overflow-hidden">
        {/* Decorative Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27]/30 via-[#2D5A27] to-[#2D5A27]/50"></div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-white flex items-center justify-center shadow-sm">
            <Coins size={20} />
          </div>
          <span className="text-xs font-bold text-[#2D5A27]/70 uppercase tracking-widest leading-none">
            {t("points_balance")}
          </span>
        </div>
        {pointsLoading ? (
          <Skeleton className="h-10 w-40 bg-[#2D5A27]/10" />
        ) : (
          <p className="text-4xl font-extrabold text-secondary-dark tracking-tight">
            {formatNumberWithCommasAndDecimals(
              points?.points_accumulated,
              0
            )}
            <span className="text-base font-semibold text-secondary-dark/60 ml-1.5">
              {t("pts")}
            </span>
          </p>
        )}
        <Link to="/redeem-rewards" className="mt-4 block">
          <Button className="bg-[#2D5A27] hover:bg-[#1E3B1A] text-white rounded-xl h-10 px-5 text-sm font-medium transition-all w-full cursor-pointer shadow-sm">
            <Gift size={16} className="mr-2" />
            {t("redeem_rewards")}
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-secondary-dark tracking-tight mb-4">
          {t("recent_activity")}
        </h3>
        {historyLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : recentActivities.length > 0 ? (
          <ul className="flex flex-col gap-0 flex-1">
            {recentActivities.map((activity) => {
              const isExchange = activity.activity_type === "exchange";
              const isRefunded = !isExchange && (activity.status === "cancelled" || activity.status === "rejected");
              return (
                <li
                  key={`${activity.activity_type}-${activity.id}`}
                  className="flex items-center gap-3 py-3 border-b border-warm-tan/10 last:border-0"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isExchange ? 'bg-green-50' : 'bg-warm-beige'}`}>
                    {isExchange ? (
                      <Recycle size={16} className="text-green-600" />
                    ) : (
                      <Package size={16} className="text-secondary-dark/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="text-sm font-medium text-secondary-dark truncate">
                      {isExchange ? activity.material_name : activity.reward_name}
                    </span>
                    <span className="text-[10px] text-secondary-dark/40 uppercase tracking-tight">
                      {t(isExchange ? "exchange" : "redeem")}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-sm font-bold ${isExchange ? 'text-green-600' : 'text-secondary-dark/60'}`}>
                      {isExchange ? '+' : isRefunded ? '' : '-'}{isRefunded ? 0 : activity.points}
                    </span>
                    {activity.status && (
                      <Badge
                        className="font-normal text-[10px] px-1.5 py-0 h-4 shrink-0"
                        variant={activity.status as any}
                      >
                        {capitalizeWordStart(activity.status)}
                      </Badge>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <Recycle
              size={28}
              className="text-secondary-dark/15 mb-2"
            />
            <p className="text-sm text-secondary-dark/40">
              {t("no_activity_yet")}
            </p>
            <p className="text-xs text-secondary-dark/30">
              {t("no_activity_sub")}
            </p>
          </div>
        )}
        <Link
          to="/activity-history"
          className="inline-flex items-center gap-1.5 text-primary-main text-sm font-medium hover:underline mt-4 group"
        >
          {t("view_full_history")}
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
