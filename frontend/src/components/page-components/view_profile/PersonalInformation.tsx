import { UserProfile } from "@/types/user.type";
import KeyValuePair from "./analytics/KeyValuePair";
import useEditProfileContext from "@/hooks/useEditProfileContext";
import EditBasicInformation from "./editing/EditBasicInformation";
import { useQuery } from "@tanstack/react-query";
import useUserContext from "@/hooks/useUserContext";
import axios from "axios";
import EditContactInformation from "./editing/EditContactInformation";
import EditProfileButton from "./editing/EditProfileButton";
import { formatDate } from "date-fns";
import { capitalizeFirstLetter, displayFullName } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PersonalInformationSkeleton from "@/components/skeletons/profile/PersonalInformationSkeleton";
import GenericError from "@/components/general/GenericError";
import ChangePasswordButton from "./ChangePasswordButton";
import { User, Calendar, MapPin, Phone, Mail, IdCard, Contact, BadgeCheck } from "lucide-react";

export default function PersonalInformation({ id }: { id?: number }) {
  const { t } = useTranslation("profile");
  const { t: form } = useTranslation("form");

  const { state: editProfile } = useEditProfileContext();
  const { state: userContext } = useUserContext();

  // if id is not provided, it means the user is viewing their own profile
  // if id is provided, it means the user (admin) is viewing another user's profile
  const user_id = id || userContext?.user_id;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", user_id],
    queryFn: async () => {
      const result = await axios.get<UserProfile>(`/api/user/${user_id}`);
      return result.data;
    },
  });

  if (isLoading) return <PersonalInformationSkeleton />;
  if (!user || !user_id) return <GenericError />;

  return (
    <>
      <div className="flex flex-col gap-6 max-lg:text-sm">
        {/* Action Buttons Top Right for Desktop, Bottom for Mobile */}
        <div className="flex gap-3 max-md:flex-col justify-end w-full">
          <EditProfileButton user_id={user_id} />
          {!editProfile.isEditing && <ChangePasswordButton user_id={user_id}/>}
        </div>

        <div
          className={cn(
            "flex gap-6 flex-row max-md:flex-col",
            editProfile.isEditing && "flex-col"
          )}
        >
          {/* Basic Information Card */}
          <div
            id="basic-information"
            className={cn(
              "flex flex-col h-full bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow",
              editProfile.isEditing ? "w-full" : "w-1/2 max-md:w-full"
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-primary-main/10 transition-colors"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary-main/10 text-primary-main rounded-xl">
                <IdCard className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-foreground">
                {t("profile.basic_information")}
              </p>
            </div>
            
            {!editProfile.isEditing ? (
              <div className="flex flex-col gap-5 flex-1 z-10">
                <div className="flex gap-4 items-start">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <KeyValuePair head={form("name")}>
                    <span className="flex gap-2 font-medium">{displayFullName(user)}</span>
                  </KeyValuePair>
                </div>
                
                <div className="flex gap-4 items-start">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0 opacity-70" />
                  <KeyValuePair
                    head={form("gender")}
                    value={capitalizeFirstLetter(user?.gender)}
                    valueClassName="font-medium"
                  />
                </div>
                
                <div className="flex gap-4 items-start">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <KeyValuePair
                    head={form("birthdate")}
                    value={formatDate(new Date(user?.birthdate), "MMMM dd, yyyy")}
                    valueClassName="font-medium"
                  />
                </div>
                
                <div className="flex gap-4 items-start">
                  <BadgeCheck className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <KeyValuePair
                    head={t("profile.account_created")}
                    value={formatDate(new Date(user?.createdAt), "MMMM dd, yyyy")}
                    valueClassName="font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="z-10">
                <EditBasicInformation />
              </div>
            )}
          </div>

          {/* Contact Information Card */}
          <div
            id="contact-information"
            className={cn(
              "flex flex-col h-full bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow",
              editProfile.isEditing ? "w-full" : "w-1/2 max-md:w-full"
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-primary-main/10 transition-colors"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary-main/10 text-primary-main rounded-xl">
                <Contact className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-foreground">
                {t("profile.contact_information")}
              </p>
            </div>
            
            {!editProfile.isEditing ? (
              <div className="flex flex-col gap-5 flex-1 z-10">
                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <KeyValuePair 
                    head="Email" 
                    value={user?.email} 
                    valueClassName="font-medium break-all" 
                  />
                </div>
                
                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <KeyValuePair
                    head={form("contact_number")}
                    value={user?.contact_number}
                    valueClassName="font-medium"
                  />
                </div>
                
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <KeyValuePair 
                    head={form("address")} 
                    value={user?.address} 
                    valueClassName="font-medium" 
                  />
                </div>
              </div>
            ) : (
              <div className="z-10">
                <EditContactInformation email={user?.email} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
