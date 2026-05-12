import { Skeleton } from "@/components/ui/skeleton";
import AnnouncementHeaderSkeleton from "./AnnouncementHeaderSkeleton";

export default function AnnouncementCardSkeleton({
  viewing,
}: {
  viewing?: boolean;
}) {
  return (
    <li className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 w-full h-full">
      <AnnouncementHeaderSkeleton />
      <div>
        <Skeleton className="w-full h-3 mt-2" />
        <Skeleton className="w-full h-3 mt-2" />
      </div>
      <Skeleton className={viewing ? "h-[250px]" :"h-[200px]"} />
    </li>
  );
}
