import useFullUserContext from "@/hooks/useFullUserContext";
import { capitalizeFirstLetter } from "@/lib/format";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function WelcomeHeader() {
  const { t } = useTranslation("user_home");
  const { state: fullUser } = useFullUserContext();

  const firstName = fullUser?.first_name
    ? capitalizeFirstLetter(fullUser.first_name)
    : "";

  const memberSince = fullUser?.createdAt
    ? format(new Date(fullUser.createdAt), "MMMM yyyy")
    : "";

  if (!firstName) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-56" />
      </div>
    );
  }

  return (
    <div className="relative bg-warm-cream rounded-2xl px-6 py-5 max-md:px-4 max-md:py-4 flex-1 border border-[#2D5A27]/10 shadow-[0_2px_8px_rgba(45,90,39,0.02)]">
      <div className="flex flex-col">
        <h1 className="text-3xl max-lg:text-2xl max-md:text-xl font-extrabold tracking-tight text-secondary-dark">
          {t("welcome_back")}
          <span className="text-[#2D5A27]">{firstName}</span>!
        </h1>
        {memberSince && (
          <p className="text-sm text-secondary-dark/70 font-medium mt-1">
            {t("member_since")}{memberSince}
          </p>
        )}
      </div>
    </div>
  );
}
