import { Skeleton } from "../ui/skeleton";

export default function RewardCardSkeleton({
  length = 6,
}: {
  length?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length }).map((_, index) => (
        <div
          key={`reward-card-skeleton-${index}`}
          className="flex flex-col border border-border bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
        >
          {/* Top Banner/Icon placeholder */}
          <div className="h-36 w-full bg-secondary-light flex items-center justify-center border-b border-border/50">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          {/* Info section placeholder */}
          <div className="p-5 flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
              <Skeleton className="h-7 w-16 rounded-full shrink-0" />
            </div>

            {/* Quantity select placeholder */}
            <div className="flex flex-col gap-1.5 mt-2">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Action button placeholder */}
            <Skeleton className="h-10 w-full rounded-lg mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
