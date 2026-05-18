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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-16 py-12">
      {/* Minimalist Profile Header */}
      <div className="flex flex-col gap-8 max-md:gap-6">
        {/* Avatar - Clean and Simple */}
        <div className="flex items-start gap-8 max-md:gap-6 max-md:items-center max-md:justify-center">
          <div className="h-24 w-24 rounded-full bg-primary-main/10 flex items-center justify-center text-primary-main shrink-0 max-md:h-20 max-md:w-20">
            {user?.first_name ? (
              <span className="text-3xl font-light max-md:text-2xl">
                {user.first_name.charAt(0).toUpperCase()}
                {user.last_name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={40} />
            )}
          </div>
          
          {/* User Info - Minimalist */}
          <div className="flex flex-col gap-3 flex-1 max-md:text-center max-md:gap-2">
            <div className="flex items-baseline gap-3 max-md:justify-center max-md:flex-wrap">
              <h1 className="text-5xl font-light text-foreground max-md:text-4xl tracking-tight">
                {user ? `${user.first_name}` : t("profile.title")}
              </h1>
              {user?.role === "admin" || user?.role === "super_admin" ? (
                <div className="flex items-center gap-1.5 text-primary-main">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {capitalizeFirstLetter(user.role.replace("_", " "))}
                  </span>
                </div>
              ) : null}
            </div>
            <p className="text-lg text-muted-foreground font-light">
              {user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground/70 pt-2">
              {user?.email}
            </p>
            {user?.role && !user?.role.includes("admin") && (
              <span className="inline-flex w-fit text-xs text-muted-foreground/60 font-light max-md:justify-center max-md:mx-auto">
                {capitalizeFirstLetter(user.role.replace("_", " "))}
              </span>
            )}
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-border/40"></div>
      </div>

      {/* Content Sections */}
      <div className="flex flex-col gap-16">
        <PersonalInformation id={targetId} />
        {user_id && (
          <div className="flex flex-col gap-10">
            <div className="w-full h-px bg-border/40"></div>
            <UserAnalytics user_id={user_id} />
          </div>
        )}
      </div>
    </div>
  );
}
