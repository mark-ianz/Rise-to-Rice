import useUserContext from "@/hooks/useUserContext";
import NavLinks from "./NavLinks";
import ProfileButton from "./ProfileButton";
import GuestActions from "./GuestActions";

export default function BigScreenHeaderNavs() {
  const { state } = useUserContext();
  const isAuth = !!state.account_id;

  return (
    <div className="flex items-center gap-10 max-xl:gap-6 max-lg:gap-4 max-lg:hidden">
      <NavLinks />
      {isAuth ? <ProfileButton /> : <GuestActions />}
    </div>
  );
}
