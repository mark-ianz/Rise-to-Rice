import { Skeleton } from "@/components/ui/skeleton";
import KeyValuePairSkeleton from "./KeyValuePairSkeleton";

export default function SideKeyValuePairSkeleton() {
  return (
    <div className="w-1/2 flex flex-col gap-4">
      <Skeleton className="h-6 w-52" />
      <KeyValuePairSkeleton />
      <KeyValuePairSkeleton />
      <KeyValuePairSkeleton />
      <KeyValuePairSkeleton />
      <KeyValuePairSkeleton />
    </div>
  );
}
