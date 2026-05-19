import { useTranslation } from "react-i18next";
import PersonalInformation from "./PersonalInformation";
import UserAnalytics from "./analytics/Analytics";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserProfile } from "@/types/user.type";
import useUserContext from "@/hooks/useUserContext";
import useEditProfileContext from "@/hooks/useEditProfileContext";
import { User, ShieldCheck, Mail } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/format";
import EditProfileButton from "./editing/EditProfileButton";
import ChangePasswordButton from "./ChangePasswordButton";

export default function ViewProfile({ user_id }: { user_id?: number }) {
  const { t } = useTranslation("profile");
  const { state: userContext } = useUserContext();
  const { state: editProfile } = useEditProfileContext();

  const targetId = user_id || userContext?.user_id || undefined;

  const { data: user } = useQuery({
    queryKey: ["user", targetId],
    queryFn: async () => {
      const result = await axios.get<UserProfile>(`/api/user/${targetId}`);
      return result.data;
    },
    enabled: !!targetId,
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 py-8">
      {/* Modern Premium Profile Header Card */}
      <div className="flex flex-col gap-6 bg-white dark:bg-card border border-border/60 dark:border-border/10 rounded-2xl p-8 max-sm:p-6 shadow-sm relative overflow-hidden">
        {/* Decorative Top Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-main/30 via-primary-main to-primary-main/50"></div>
        
        <div className="flex justify-between items-center gap-6 max-md:flex-col max-md:items-center max-md:text-center w-full">
          {/* Left Side: Avatar & Details */}
          <div className="flex items-center gap-6 max-md:flex-col max-md:items-center max-md:gap-4">
            {/* Avatar with ring effect */}
            <div className="h-24 w-24 rounded-full bg-primary-main/10 flex items-center justify-center text-primary-main shrink-0 ring-4 ring-primary-main/5 border border-primary-main/20 transition-all duration-300 hover:scale-105">
              {user?.first_name ? (
                <span className="text-3xl font-light tracking-tight max-md:text-2xl">
                  {user.first_name.charAt(0).toUpperCase()}
                  {user.last_name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={40} />
              )}
            </div>
            
            {/* User Info details */}
            <div className="flex flex-col gap-2 max-md:items-center">
              <div className="flex items-center gap-3 flex-wrap max-md:justify-center">
                <h1 className="text-3xl font-light text-foreground max-md:text-2xl tracking-tight leading-none">
                  {user ? `${user.first_name} ${user.last_name}` : t("profile.title")}
                </h1>
                {(user?.role === "admin" || user?.role === "super_admin") && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-main/10 text-primary-main border border-primary-main/20">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider leading-none">
                      {capitalizeFirstLetter(user.role.replace("_", " "))}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                <Mail className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                <span>{user?.email}</span>
              </div>
              
              {user?.role && !user?.role.includes("admin") && (
                <span className="inline-flex text-[10px] px-2.5 py-0.5 rounded-full bg-secondary-main/10 text-secondary-dark border border-secondary-main/20 font-semibold uppercase tracking-wider">
                  {capitalizeFirstLetter(user.role.replace("_", " "))}
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Actions (Edit / Change Password) */}
          {targetId && (
            <div className="flex gap-3 max-md:flex-col items-center max-md:w-full shrink-0">
              <EditProfileButton user_id={targetId} />
              {!editProfile.isEditing && <ChangePasswordButton user_id={targetId} />}
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex flex-col gap-10">
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
