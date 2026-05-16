import { Points as PointsType } from "@/types/points";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Coins, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumberWithCommasAndDecimals } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import useUserContext from "@/hooks/useUserContext";
import { useGetRedeemHistory } from "@/hooks/query/useRedeemRequest";
import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart, formatUnit } from "@/lib/format";
import { format } from "date-fns";

export default function PointsRewardsCard() {
  const { state } = useUserContext();

  const { data: points, isLoading: pointsLoading } = useQuery({
    queryKey: ["user-points"],
    queryFn: async () => {
      const response = await axios.get<PointsType>("/api/points/");
      return response.data;
    },
  });

  const { data: redeemHistory, isLoading: historyLoading } =
    useGetRedeemHistory({
      status: [],
      page: 1,
      endpoint: `/api/redeem-request/user/${state.user_id}`,
    });

  const recentRedemptions = redeemHistory?.result?.slice(0, 3) || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-tan/15 overflow-hidden h-full flex flex-col">
      {/* Points Header */}
      <div className="bg-gradient-to-br from-primary-main to-primary-main-dark p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <Coins size={20} />
          </div>
          <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
            Points Balance
          </span>
        </div>
        {pointsLoading ? (
          <Skeleton className="h-10 w-40 bg-white/20" />
        ) : (
          <p className="text-4xl max-lg:text-3xl max-md:text-2xl font-bold tracking-tight">
            {formatNumberWithCommasAndDecimals(
              points?.points_accumulated,
              0
            )}
            <span className="text-lg max-md:text-base font-normal text-white/70 ml-1.5">
              pts
            </span>
          </p>
        )}
        <Link to="/redeem-rewards" className="mt-4 block">
          <Button className="bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl h-10 px-5 text-sm font-medium transition-all backdrop-blur-sm w-full">
            <Gift size={16} className="mr-2" />
            Redeem Rewards
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-secondary-dark tracking-tight mb-4">
          Recent Activity
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
        ) : recentRedemptions.length > 0 ? (
          <ul className="flex flex-col gap-0 flex-1">
            {recentRedemptions.map((request) => (
              <li
                key={request.redeem_request_id}
                className="flex items-center gap-3 py-3 border-b border-warm-tan/10 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-warm-beige flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-secondary-dark/50" />
                </div>
                <span className="text-sm font-medium text-secondary-dark truncate min-w-0 flex-1">
                  {request.reward_name}
                </span>
                <span className="text-sm text-secondary-dark/50 flex-shrink-0">
                  {request.quantity}{" "}
                  {formatUnit(request.unit, request.quantity)}
                </span>
                <span className="text-sm text-secondary-dark/40 flex-shrink-0">
                  {format(new Date(request.timestamp), "MMM d")}
                </span>
                <Badge
                  className="font-normal text-xs px-2 py-0.5 shrink-0"
                  variant={request.status}
                >
                  {capitalizeWordStart(request.status)}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <Gift
              size={28}
              className="text-secondary-dark/15 mb-2"
            />
            <p className="text-sm text-secondary-dark/40">
              No redemptions yet
            </p>
            <p className="text-xs text-secondary-dark/30">
              Redeem your points for exciting rewards!
            </p>
          </div>
        )}
        <Link
          to="/redeem-history"
          className="inline-flex items-center gap-1.5 text-primary-main text-sm font-medium hover:underline mt-4 group"
        >
          View full history
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
