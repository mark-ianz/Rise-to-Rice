import { Skeleton } from "@/components/ui/skeleton";

export default function KeyValuePairSkeleton() {
  return (
    <span>
      <Skeleton className="w-32 h-3" />
      <Skeleton className="w-full max-w-72 h-4 mt-1" />
    </span>
  );
}
