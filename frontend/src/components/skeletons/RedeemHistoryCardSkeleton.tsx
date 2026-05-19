import { Skeleton } from "../ui/skeleton";

export default function RedeemHistoryCardSkeleton({
  length = 12,
}: {
  length?: number;
}) {
  return Array.from({ length }).map((_, index) => (
    <li
      key={`redeem-history-card-skeleton-${index}`}
      className="flex flex-col gap-4 border border-l-4 border-l-slate-200 p-5 pl-6 rounded-2xl bg-white shadow-sm border-warm-tan/10 h-[160px] justify-between"
    >
      <div className="flex justify-between items-start gap-3">
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-50 flex justify-between items-center mt-1">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </li>
  ));
}
