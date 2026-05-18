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
      <div className="flex flex-col gap-12 max-lg:text-sm">
        {/* Action Buttons */}
        <div className="flex gap-3 max-md:flex-col justify-end w-full pt-4">
          <EditProfileButton user_id={user_id} />
          {!editProfile.isEditing && <ChangePasswordButton user_id={user_id}/>}
        </div>

        <div
          className={cn(
            "flex gap-12 flex-row max-md:flex-col",
            editProfile.isEditing && "flex-col"
          )}
        >
          {/* Basic Information */}
          <div
            id="basic-information"
            className={cn(
              "flex flex-col h-full",
              editProfile.isEditing && "w-full"
            )}
          >
            {!editProfile.isEditing ? (
              <div className="flex flex-col gap-8 flex-1">
                <h2 className="text-2xl font-light text-foreground">
                  {t("profile.basic_information")}
                </h2>
                
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                      {form("name")}
                    </p>
                    <p className="text-lg text-foreground font-light">
                      {displayFullName(user)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                      {form("gender")}
                    </p>
                    <p className="text-lg text-foreground font-light">
                      {capitalizeFirstLetter(user?.gender)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                      {form("birthdate")}
                    </p>
                    <p className="text-lg text-foreground font-light">
                      {formatDate(new Date(user?.birthdate), "MMMM dd, yyyy")}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                      {t("profile.account_created")}
                    </p>
                    <p className="text-lg text-foreground font-light">
                      {formatDate(new Date(user?.createdAt), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <EditBasicInformation />
            )}
          </div>

          {/* Contact Information */}
          <div
            id="contact-information"
            className={cn(
              "flex flex-col h-full",
              editProfile.isEditing && "w-full"
            )}
          >
            {!editProfile.isEditing ? (
              <div className="flex flex-col gap-8 flex-1">
                <h2 className="text-2xl font-light text-foreground">
                  {t("profile.contact_information")}
                </h2>
                
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-lg text-foreground font-light break-all">
                      {user?.email}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                      {form("contact_number")}
                    </p>
                    <p className="text-lg text-foreground font-light">
                      {user?.contact_number}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                      {form("address")}
                    </p>
                    <p className="text-lg text-foreground font-light">
                      {user?.address}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <EditContactInformation email={user?.email} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
