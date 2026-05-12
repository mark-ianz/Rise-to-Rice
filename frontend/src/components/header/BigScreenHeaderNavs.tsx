import NavLinks from "./NavLinks";
import ProfileButton from "./ProfileButton";

export default function BigScreenHeaderNavs() {
  return (
    <div className="flex items-center gap-10 max-xl:gap-6 max-lg:gap-4 max-lg:hidden">
      <NavLinks />
      <ProfileButton />
    </div>
  );
}
