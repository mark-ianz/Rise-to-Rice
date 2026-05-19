import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart } from "@/lib/format";
import { ActivityLog } from "@/types/activity";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Recycle, Package, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  activity: ActivityLog;
};

export default function ActivityHistoryCard({ activity }: Props) {
  const { t } = useTranslation("redeem_rewards");
  const isExchange = activity.activity_type === 'exchange';

  if (isExchange) {
    return <MaterialExchangeCard activity={activity} t={t} />;
  }

  return <RewardRedemptionCard activity={activity} t={t} />;
}

function MaterialExchangeCard({ activity, t }: { activity: ActivityLog; t: any }) {
  const linkTo = `/activity-history/exchange/${activity.nano_id}`;
  const displayDate = new Date(activity.timestamp);

  return (
    <li>
      <Link 
        to={linkTo} 
        className="flex flex-col justify-between gap-4 border border-slate-100 p-5 rounded-2xl bg-white hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 block h-full"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              <Recycle size={10} />
              {t("activity_history.material_exchange")}
            </span>
            <h3 className="text-secondary-dark font-bold text-lg leading-tight mt-1.5 truncate">
              {activity.material_name}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-base font-bold text-emerald-600">
              +{activity.points} pts
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm py-2 px-3 bg-slate-50 rounded-xl">
            <span className="text-muted-foreground">{t("activity_history.weight")}</span>
            <span className="font-semibold text-secondary-dark">{activity.weight} kg</span>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            <span>{format(displayDate, "MMMM dd, yyyy • hh:mm a")}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

function RewardRedemptionCard({ activity, t }: { activity: ActivityLog; t: any }) {
  const linkTo = `/activity-history/redeem/${activity.nano_id}`;
  const isRefunded = activity.status === 'cancelled' || activity.status === 'rejected';
  const displayDate = new Date(activity.timestamp);

  return (
    <li>
      <Link 
        to={linkTo} 
        className="flex flex-col justify-between gap-4 border border-slate-100 p-5 rounded-2xl bg-white hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 block h-full"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              <Package size={10} />
              {t("activity_history.reward_redemption")}
            </span>
            <h3 className="text-secondary-dark font-bold text-lg leading-tight mt-1.5 truncate">
              {activity.reward_name}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <span className={`text-base font-bold ${isRefunded ? 'text-slate-500 line-through' : 'text-red-500'}`}>
              {isRefunded ? `-${activity.points}` : `-${activity.points}`} pts
            </span>
            {isRefunded && (
              <span className="block text-[10px] font-semibold text-emerald-600 mt-0.5 bg-emerald-50 px-1.5 py-0.5 rounded text-center">
                Refunded
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm py-2 px-3 bg-slate-50 rounded-xl">
            <span className="text-muted-foreground">{t("terms.status")}</span>
            <Badge
              className="font-semibold px-2.5 py-0.5 rounded-full text-xs shadow-none border-none"
              variant={activity.status as any}
            >
              {capitalizeWordStart(
                t(`redeem_history.status.${activity.status?.toLocaleLowerCase()}`)
              )}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              <span>{format(displayDate, "MMMM dd, yyyy • hh:mm a")}</span>
            </div>
            {activity.updated_at && activity.updated_at !== activity.timestamp && (
              <span className="text-[10px] text-muted-foreground italic">
                Updated {format(new Date(activity.updated_at), "MMM dd")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
