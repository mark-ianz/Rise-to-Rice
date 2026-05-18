import { useTranslation } from "react-i18next";
import HeaderText from "../../general/HeaderText";
import PersonalInformation from "./PersonalInformation";
import UserAnalytics from "./analytics/Analytics";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserProfile } from "@/types/user.type";
import useUserContext from "@/hooks/useUserContext";
import { User, ShieldCheck } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/format";

export default function ViewProfile({ user_id }: { user_id?: number }) {
  const { t } = useTranslation("profile");
  const { state: userContext } = useUserContext();

  const targetId = user_id || userContext?.user_id;

  const { data: user } = useQuery({
    queryKey: ["user", targetId],
    queryFn: async () => {
      const result = await axios.get<UserProfile>(`/api/user/${targetId}`);
      return result.data;
    },
    enabled: !!targetId,
  });

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Profile Header Banner - Enhanced */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-main/15 via-primary-main/5 to-primary-main/0 border border-primary-main/25 p-10 flex items-center gap-8 max-md:flex-col max-md:text-center max-md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-main/8 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-main/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none"></div>
        
        {/* Avatar */}
        <div className="relative z-10">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-main to-primary-main/70 flex items-center justify-center text-white shadow-xl shrink-0 border-4 border-white dark:border-card/50 backdrop-blur-sm ring-4 ring-primary-main/20 max-md:h-28 max-md:w-28">
            {user?.first_name ? (
              <span className="text-5xl font-bold max-md:text-4xl">
                {user.first_name.charAt(0).toUpperCase()}
                {user.last_name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={48} />
            )}
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex flex-col gap-2 flex-1 z-10">
          <div className="flex items-center gap-3 max-md:justify-center max-md:flex-wrap">
            <h2 className="text-4xl font-bold text-foreground tracking-tight max-md:text-3xl">
              {user ? `${user.first_name} ${user.last_name}` : t("profile.title")}
            </h2>
            {user?.role === "admin" || user?.role === "super_admin" ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-main/15 text-primary-main rounded-lg">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider hidden max-sm:inline">
                  {capitalizeFirstLetter(user.role.replace("_", " "))}
                </span>
              </div>
            ) : null}
          </div>
          <p className="text-muted-foreground font-medium text-base max-md:text-sm">
            {user?.email}
          </p>
          {user?.role && !user?.role.includes("admin") && (
            <span className="inline-flex w-fit px-3 py-1.5 rounded-full bg-primary-main/10 text-primary-main text-xs font-bold uppercase tracking-wider max-md:mx-auto">
              {capitalizeFirstLetter(user.role.replace("_", " "))}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <PersonalInformation id={targetId} />
        {user_id && (
          <>
            <div className="w-full h-[1px] bg-border my-2"></div>
            <UserAnalytics user_id={user_id} />
          </>
        )}
      </div>
    </div>
  );
}
