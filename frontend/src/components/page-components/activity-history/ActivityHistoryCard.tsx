import { Badge } from "@/components/ui/badge";
import { capitalizeWordStart, formatNumberWithCommasAndDecimals } from "@/lib/format";
import { ActivityLog } from "@/types/activity";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Recycle, Package, Calendar, ChevronRight } from "lucide-react";
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
    <li className="relative pl-8 md:pl-10 pb-6 group last:pb-2">
      {/* Timeline Connector vertical overlay segment */}
      <div className="absolute left-[15px] top-[32px] bottom-0 w-0.5 bg-slate-100 dark:bg-zinc-800 group-last:hidden"></div>

      {/* Timeline Bullet with Recycle Icon */}
      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C68B59] group-hover:text-white group-hover:border-[#C68B59] z-10">
        <Recycle size={14} className="transition-transform duration-500 group-hover:rotate-180" />
      </div>

      <Link
        to={linkTo}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-100 dark:border-border/10 p-5 rounded-2xl bg-white dark:bg-card hover:border-[#C68B59]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:bg-[#C68B59]/8 dark:hover:bg-[#C68B59]/15 dark:hover:border-[#C68B59]/30 transition-all duration-300 w-full"
      >
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
              {t("activity_history.material_exchange")}
            </span>
            <span className="text-xs text-muted-foreground/60">• {format(displayDate, "hh:mm a")}</span>
          </div>
          <h3 className="text-secondary-dark dark:text-foreground font-semibold text-lg leading-tight mt-1 truncate">
            {activity.material_name}
          </h3>
          <div className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-0.5">
            <Calendar size={13} className="text-slate-400 dark:text-zinc-500 shrink-0" />
            <span>{format(displayDate, "MMMM dd, yyyy")}</span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50 dark:border-border/10">
          <div className="flex flex-col items-start sm:items-end gap-0.5 leading-none">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">{t("activity_history.weight")}</span>
            <span className="font-semibold text-secondary-dark dark:text-foreground text-sm mt-0.5">{formatNumberWithCommasAndDecimals(activity.weight ?? undefined)} kg</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="inline-flex text-base font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-xl">
                +{formatNumberWithCommasAndDecimals(activity.points ?? undefined)} pts
              </span>
            </div>
            {/* Hover arrow indicator */}
            <div className="text-muted-foreground/30 group-hover:text-[#C68B59] dark:group-hover:text-[#C68B59] group-hover:translate-x-1 transition-all duration-300 max-sm:hidden">
              <ChevronRight size={18} />
            </div>
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

  // Status-specific colors
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20';
      case 'pending':
        return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20';
      case 'for pick up':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20';
      case 'cancelled':
      case 'rejected':
        return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20';
      default:
        return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-zinc-800';
    }
  };

  return (
    <li className="relative pl-8 md:pl-10 pb-6 group last:pb-2">
      {/* Timeline Connector vertical overlay segment */}
      <div className="absolute left-[15px] top-[32px] bottom-0 w-0.5 bg-slate-100 dark:bg-zinc-800 group-last:hidden"></div>

      {/* Timeline Bullet with Package Icon */}
      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-500/30 flex items-center justify-center text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C68B59] group-hover:text-white group-hover:border-[#C68B59] z-10">
        <Package size={14} className="transition-transform duration-300 group-hover:rotate-6" />
      </div>

      <Link
        to={linkTo}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-100 dark:border-border/10 p-5 rounded-2xl bg-white dark:bg-card hover:border-[#C68B59]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:bg-[#C68B59]/8 dark:hover:bg-[#C68B59]/15 dark:hover:border-[#C68B59]/30 transition-all duration-300 w-full"
      >
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded">
              {t("activity_history.reward_redemption")}
            </span>
            <span className="text-xs text-muted-foreground/60">• {format(displayDate, "hh:mm a")}</span>
          </div>
          <h3 className="text-secondary-dark dark:text-foreground font-semibold text-lg leading-tight mt-1 truncate">
            {activity.reward_name}
          </h3>
          <div className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-0.5">
            <Calendar size={13} className="text-slate-400 dark:text-zinc-500 shrink-0" />
            <span>{format(displayDate, "MMMM dd, yyyy")}</span>
            {activity.updated_at && activity.updated_at !== activity.timestamp && (
              <span className="text-[10px] text-muted-foreground/50 italic ml-1 max-sm:hidden">
                (Updated {format(new Date(activity.updated_at), "MMM dd")})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50 dark:border-border/10">
          <div className="flex flex-col items-start sm:items-end gap-0.5 leading-none">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">{t("terms.status")}</span>
            <Badge
              className={`font-semibold px-2.5 py-0.5 rounded-full text-xs shadow-none border-none mt-0.5 ${getStatusStyle(activity.status || "")}`}
            >
              {capitalizeWordStart(
                t(`redeem_history.status.${activity.status?.toLocaleLowerCase()}`)
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right flex flex-col items-end gap-0.5">
              <span className={`text-base font-bold ${isRefunded ? 'text-slate-400 dark:text-zinc-500 line-through' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 rounded-xl'}`}>
                -{formatNumberWithCommasAndDecimals(activity.points ?? undefined)} pts
              </span>
              {isRefunded && (
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1 py-0.5 rounded uppercase tracking-wider scale-90 origin-right">
                  Refunded
                </span>
              )}
            </div>
            {/* Hover arrow indicator */}
            <div className="text-muted-foreground/30 group-hover:text-[#C68B59] dark:group-hover:text-[#C68B59] group-hover:translate-x-1 transition-all duration-300 max-sm:hidden">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
