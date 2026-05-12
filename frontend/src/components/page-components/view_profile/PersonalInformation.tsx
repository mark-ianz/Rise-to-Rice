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
      <div className="flex flex-col gap-4 max-lg:text-sm">
        <div
          className={cn(
            "flex gap-8 flex-row max-sm:flex-col",
            editProfile.isEditing && "flex-col"
          )}
        >
          <div
            id="basic-information"
            className={cn(
              "max-md:w-full",
              editProfile.isEditing ? "w-full" : "w-1/2"
            )}
          >
            <p className="text-xl text-primary-main mb-4 max-lg:text-md">
              {t("profile.basic_information")}
            </p>
            {!editProfile.isEditing ? (
              <div className="flex flex-col gap-4">
                <KeyValuePair head={form("name")}>
                  <span className="flex gap-2">{displayFullName(user)}</span>
                </KeyValuePair>
                <KeyValuePair
                  head={form("gender")}
                  value={capitalizeFirstLetter(user?.gender)}
                />
                <KeyValuePair
                  head={form("birthdate")}
                  value={formatDate(new Date(user?.birthdate), "MMMM dd, yyyy")}
                />
                <KeyValuePair
                  head={t("profile.account_created")}
                  value={formatDate(
                    new Date(user?.createdAt),
                    "MMMM dd, yyyy : hh:mm a"
                  )}
                />
              </div>
            ) : (
              <EditBasicInformation />
            )}
          </div>
          <div
            id="contact-information"
            className={cn(
              "max-md:w-full",
              editProfile.isEditing ? "w-full" : "w-1/2"
            )}
          >
            <p className="text-xl text-primary-main mb-4 max-lg:text-md">
              {t("profile.contact_information")}
            </p>
            {!editProfile.isEditing ? (
              <div className="flex flex-col gap-4">
                <KeyValuePair head="Email" value={user?.email} />
                <KeyValuePair
                  head={form("contact_number")}
                  value={user?.contact_number}
                />
                <KeyValuePair head={form("address")} value={user?.address} />
              </div>
            ) : (
              <EditContactInformation email={user?.email} />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <EditProfileButton user_id={user_id} />
          {!editProfile.isEditing && <ChangePasswordButton user_id={user_id}/>}
        </div>
      </div>
    </>
  );
}
