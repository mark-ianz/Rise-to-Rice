import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementHeaderSkeleton() {
  return (
    <div className="flex gap-2">
      <span className="flex gap-2">
        <Skeleton className="w-12 h-12 rounded-full" />
      </span>
      <span>
        <Skeleton className="w-52 h-4" />
        <Skeleton className="w-24 h-2 mt-1" />
      </span>
    </div>
  );
}
