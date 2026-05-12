import { Skeleton } from "@/components/ui/skeleton";

export default function PieChartSkeleton() {
  return (
    <div className="flex items-center flex-col">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="w-72 h-8" />
        <Skeleton className="w-52 h-4" />
        <Skeleton className="w-32 h-8" />
      </div>
      <Skeleton className="w-96 rounded-full aspect-square mt-10"/>
    </div>
  );
}
