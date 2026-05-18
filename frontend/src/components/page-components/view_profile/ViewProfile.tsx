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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Profile Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-main/10 via-primary-main/5 to-transparent border border-primary-main/20 p-8 flex items-center gap-6 max-md:flex-col max-md:text-center max-md:p-6 shadow-sm">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-main to-primary-main/60 flex items-center justify-center text-white shadow-lg shrink-0 border-4 border-white/50 backdrop-blur-sm">
          {user?.first_name ? (
            <span className="text-4xl font-bold">
              {user.first_name.charAt(0).toUpperCase()}
              {user.last_name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User size={40} />
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 max-md:justify-center">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {user ? `${user.first_name} ${user.last_name}` : t("profile.title")}
            </h2>
            {user?.role === "admin" || user?.role === "super_admin" ? (
              <ShieldCheck className="text-primary-main w-6 h-6" />
            ) : null}
          </div>
          <p className="text-muted-foreground font-medium flex items-center gap-2 max-md:justify-center">
            {user?.email}
            {user?.role && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary-main/10 text-primary-main text-xs font-bold uppercase tracking-wider">
                {capitalizeFirstLetter(user.role.replace("_", " "))}
              </span>
            )}
          </p>
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
