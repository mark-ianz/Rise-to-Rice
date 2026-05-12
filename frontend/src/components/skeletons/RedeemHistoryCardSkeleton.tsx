import { Skeleton } from "../ui/skeleton";

export default function RedeemHistoryCardSkeleton({
  length = 12,
}: {
  length?: number;
}) {
  return Array.from({ length }).map((_, index) => (
    <li
      key={`redeem-history-card-skeleton-${index}`}
      className="flex flex-col gap-6 border p-4 rounded-md bg-white shadow-md"
    >
      <div>
        <Skeleton className="w-full h-3 max-w-24" />
        <Skeleton className="w-full h-3 mt-2 max-w-44" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-4 max-w-44" />
        <Skeleton className="w-full h-4 max-w-28" />
        <Skeleton className="w-full h-4 max-w-32" />
      </div>
    </li>
  ));
}
