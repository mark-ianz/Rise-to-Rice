import useFullUserContext from "@/hooks/useFullUserContext";
import { capitalizeFirstLetter } from "@/lib/format";
import { format } from "date-fns";
import { Leaf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WelcomeHeader() {
  const { state: fullUser } = useFullUserContext();

  const firstName = fullUser?.first_name
    ? capitalizeFirstLetter(fullUser.first_name)
    : "";

  const memberSince = fullUser?.createdAt
    ? format(new Date(fullUser.createdAt), "MMMM yyyy")
    : "";

  if (!firstName) {
    return (
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-56" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-3xl max-lg:text-2xl max-md:text-xl font-bold tracking-tight text-secondary-dark">
          Welcome back,{" "}
          <span className="text-primary-main">{firstName}</span>!
        </h1>
        <p className="text-secondary-dark/50 mt-1 flex items-center gap-1.5 max-md:text-sm">
          <Leaf size={16} className="text-primary-main" />
          Ready to make a difference today?
        </p>
      </div>
      {memberSince && (
        <span className="text-sm text-secondary-dark/40 bg-warm-beige px-3 py-1.5 rounded-full max-md:text-xs">
          Member since {memberSince}
        </span>
      )}
    </div>
  );
}
