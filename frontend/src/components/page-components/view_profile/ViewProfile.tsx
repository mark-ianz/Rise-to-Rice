import { useTranslation } from "react-i18next";
import HeaderText from "../../general/HeaderText";
import PersonalInformation from "./PersonalInformation";
import UserAnalytics from "./analytics/Analytics";

export default function ViewProfile({ user_id }: { user_id?: number }) {
  // this view profile component has 2 uses:
  // 1. It can be used to view the profile of the logged in user
  // 2. It can be used to view the profile of another user (only admins can do this)
  // The user_id prop is used to determine which user's profile to view
  // It's optional because if it's not provided, the component will assume that the user is viewing their own profile
  const { t } = useTranslation("profile");

  return (
    <div className="w-full">
      <HeaderText className="font-bold mb-4">{t("profile.title")}</HeaderText>
      <div className="flex flex-col gap-4">
        <PersonalInformation id={user_id} />
        <hr />
        <UserAnalytics user_id={user_id} />
      </div>
    </div>
  );
}
