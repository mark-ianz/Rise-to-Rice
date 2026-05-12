import SideKeyValuePairSkeleton from "./SideKeyValuePairSkeleton";

export default function PersonalInformationSkeleton() {
  return (
    <div className="flex gap-4">
      <SideKeyValuePairSkeleton />
      <SideKeyValuePairSkeleton />
    </div>
  );
}
