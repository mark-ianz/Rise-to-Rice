import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart } from "@/lib/format";
import { ActivityLog } from "@/types/activity";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Recycle, Package, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  activity: ActivityLog;
};

export default function ActivityHistoryCard({ activity }: Props) {
  const { t } = useTranslation("redeem_rewards");
  const isExchange = activity.activity_type === 'exchange';
  const isRefunded = !isExchange && (activity.status === 'cancelled' || activity.status === 'rejected');

  const linkTo = isExchange
    ? `/activity-history/exchange/${activity.nano_id}`
    : `/activity-history/redeem/${activity.nano_id}`;

  return (
    <li>
      <Link to={linkTo} className="flex flex-col gap-4 border p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border-warm-tan/10 block">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExchange ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {isExchange ? <Recycle size={20} /> : <Package size={20} />}
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {isExchange ? t("activity_history.material_exchange") : t("activity_history.reward_redemption")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(activity.timestamp), "MMM dd, yyyy - hh:mm a")}
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-1 font-bold ${isExchange ? 'text-green-600' : isRefunded ? 'text-secondary-dark/60' : 'text-red-500'}`}>
            {isExchange ? <TrendingUp size={16} /> : isRefunded ? <Minus size={16} /> : <TrendingDown size={16} />}
            <span>{isExchange ? '+' : isRefunded ? '' : '-'}{isRefunded ? 0 : activity.points} pts</span>
          </div>
        </div>

        <div className="space-y-2">
          {isExchange ? (
            <>
              <p className="text-secondary-dark font-semibold text-lg leading-tight">
                {activity.material_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("activity_history.weight")} <span className="text-secondary-dark font-medium">{activity.weight} kg</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-secondary-dark font-semibold text-lg leading-tight">
                {activity.reward_name}
              </p>
              <div className="flex items-center justify-between">
                <Badge
                  className="font-medium px-2.5 py-0.5 rounded-full"
                  variant={activity.status as any}
                >
                  {capitalizeWordStart(
                    t(`redeem_history.status.${activity.status?.toLocaleLowerCase()}`)
                  )}
                </Badge>
              </div>
            </>
          )}
        </div>
      </Link>
    </li>
  );
}
