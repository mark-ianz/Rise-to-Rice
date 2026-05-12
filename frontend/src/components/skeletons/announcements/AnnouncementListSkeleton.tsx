import AnnouncementCardSkeleton from "./AnnouncementCardSkeleton";

export default function AnnouncementListSkeleton({
  length,
}: {
  length: number;
}) {
  const announcements_skeleton = Array.from({ length });

  return (
    <ul className="flex flex-col gap-4 w-full">
      {announcements_skeleton.map((_, index) => (
        <AnnouncementCardSkeleton key={index} />
      ))}
    </ul>
  );
}
