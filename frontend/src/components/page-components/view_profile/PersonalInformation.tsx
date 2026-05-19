import { UserProfile } from "@/types/user.type";
import useEditProfileContext from "@/hooks/useEditProfileContext";
import EditBasicInformation from "./editing/EditBasicInformation";
import { useQuery } from "@tanstack/react-query";
import useUserContext from "@/hooks/useUserContext";
import axios from "axios";
import EditContactInformation from "./editing/EditContactInformation";
import { formatDate } from "date-fns";
import { capitalizeFirstLetter, displayFullName } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PersonalInformationSkeleton from "@/components/skeletons/profile/PersonalInformationSkeleton";
import GenericError from "@/components/general/GenericError";
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
    <div className="flex flex-col gap-8 max-lg:text-sm">
      <div
        className={cn(
          "flex gap-8 flex-row max-md:flex-col",
          editProfile.isEditing && "flex-col"
        )}
      >
        {/* Basic Information Card */}
        <div
          id="basic-information"
          className={cn(
            "flex-1 bg-white dark:bg-card border border-border/60 dark:border-border/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300",
            editProfile.isEditing && "w-full"
          )}
        >
          {!editProfile.isEditing ? (
            <div className="flex flex-col gap-6 flex-1">
              {/* Header Title Area */}
              <div className="flex items-center gap-3 border-b border-border/30 dark:border-border/10 pb-4">
                <div className="p-2 rounded-lg bg-primary-main/10 text-primary-main">
                  <User size={18} />
                </div>
                <h2 className="text-xl font-light text-foreground">
                  {t("profile.basic_information")}
                </h2>
              </div>
              
              {/* Profile Details List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted text-muted-foreground/80 shrink-0 mt-0.5">
                    <IdCard size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider leading-none">
                      {form("name")}
                    </span>
                    <span className="text-base text-foreground font-light">
                      {displayFullName(user)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted text-muted-foreground/80 shrink-0 mt-0.5">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider leading-none">
                      {form("gender")}
                    </span>
                    <span className="text-base text-foreground font-light">
                      {capitalizeFirstLetter(user?.gender)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted text-muted-foreground/80 shrink-0 mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider leading-none">
                      {form("birthdate")}
                    </span>
                    <span className="text-base text-foreground font-light">
                      {formatDate(new Date(user?.birthdate), "MMMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted text-muted-foreground/80 shrink-0 mt-0.5">
                    <BadgeCheck size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider leading-none">
                      {t("profile.account_created")}
                    </span>
                    <span className="text-base text-foreground font-light">
                      {formatDate(new Date(user?.createdAt), "MMMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-border/30 dark:border-border/10 pb-4">
                <div className="p-2 rounded-lg bg-primary-main/10 text-primary-main">
                  <User size={18} />
                </div>
                <h2 className="text-xl font-light text-foreground">
                  Edit {t("profile.basic_information")}
                </h2>
              </div>
              <div className="pt-2">
                <EditBasicInformation />
              </div>
            </div>
          )}
        </div>

        {/* Contact Information Card */}
        <div
          id="contact-information"
          className={cn(
            "flex-1 bg-white dark:bg-card border border-border/60 dark:border-border/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300",
            editProfile.isEditing && "w-full"
          )}
        >
          {!editProfile.isEditing ? (
            <div className="flex flex-col gap-6 flex-1">
              {/* Header Title Area */}
              <div className="flex items-center gap-3 border-b border-border/30 dark:border-border/10 pb-4">
                <div className="p-2 rounded-lg bg-secondary-main/10 text-secondary-dark dark:text-secondary-light">
                  <Contact size={18} />
                </div>
                <h2 className="text-xl font-light text-foreground">
                  {t("profile.contact_information")}
                </h2>
              </div>
              
              {/* Contact Details List */}
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted text-muted-foreground/80 shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider leading-none">
                      Email
                    </span>
                    <span className="text-base text-foreground font-light break-all">
                      {user?.email}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted text-muted-foreground/80 shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider leading-none">
                      {form("contact_number")}
                    </span>
                    <span className="text-base text-foreground font-light">
                      {user?.contact_number}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted text-muted-foreground/80 shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider leading-none">
                      {form("address")}
                    </span>
                    <span className="text-base text-foreground font-light">
                      {user?.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-border/30 dark:border-border/10 pb-4">
                <div className="p-2 rounded-lg bg-secondary-main/10 text-secondary-dark dark:text-secondary-light">
                  <Contact size={18} />
                </div>
                <h2 className="text-xl font-light text-foreground">
                  Edit {t("profile.contact_information")}
                </h2>
              </div>
              <div className="pt-2">
                <EditContactInformation email={user?.email} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
