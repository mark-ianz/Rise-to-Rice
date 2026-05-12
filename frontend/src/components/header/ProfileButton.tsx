import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Points from "../general/Points";
import useFullUserContext from "@/hooks/useFullUserContext";
import { User } from "lucide-react";
import ProfileButtonLinks from "./ProfileButtonLinks";
import { useTranslation } from "react-i18next";

export default function ProfileButton() {
  const { state } = useFullUserContext();
  const { t } = useTranslation("header");

  const isAuth = !!state.account_id;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="rounded-full w-10 h-10 max-lg:w-8 max-lg:h-8 max-lg:text-xs flex items-center justify-center [&_svg]:!size-5">
          {isAuth ? (
            state.first_name.charAt(0).toUpperCase() +
            state.last_name.charAt(0).toUpperCase()
          ) : (
            <User />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex flex-col gap-2 text-sm max-w-fit min-w-[200px] max-lg:text-xs"
      >
        {isAuth && (
          <>
            <span className="text-md">
              {t("profile_popover.greetings")}, <span className="font-semibold">{state.first_name}</span>!
            </span>
            <Points />
            <hr />
          </>
        )}
        <ProfileButtonLinks />
      </PopoverContent>
    </Popover>
  );
}
