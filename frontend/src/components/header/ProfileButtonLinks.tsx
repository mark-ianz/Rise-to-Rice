import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import useLogout from "@/hooks/useLogout";
import useFullUserContext from "@/hooks/useFullUserContext";
import { useTranslation } from "react-i18next";
import ToggleLanguage from "./ToggleLanguage";
import { cn } from "@/lib/utils";

type PopoverContentType = {
  display_name: string;
  name: string;
  link?: string;
}[];

export default function ProfileButtonLinks({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation("header");

  const logout = useLogout();

  const { state } = useFullUserContext();
  const isAuth = !!state.account_id;

  const popoverContent = t("profile_popover.content", {
    returnObjects: true,
  }) as PopoverContentType;

  return popoverContent.map((item, index) => {
    // if the link is login or register and the user is authenticated, return null
    if (item.name === "Login" || item.name === "Register") {
      if (isAuth || !item.link) return null;

      <Link
        to={item.link}
        key={item.display_name + index}
        className={cn(
          "py-2 px-4 hover:bg-secondary-light-2 h-full",
          className
        )}
      >
        {item.display_name}
      </Link>;
    }

    // if the link is logout and the user is not authenticated, return null
    // but if the user is authenticated, return the logout button
    if (item.name === "Logout" && isAuth) {
      return (
        <Button
          onClick={logout}
          variant={"ghost"}
          key={item.display_name + index}
          className={cn(
            "rounded-none h-full py-2 font-normal px-4 hover:bg-secondary-light-2 flex items-start justify-start",
            className
          )}
        >
          {item.display_name}
        </Button>
      );
    }

    // if the link is profile or rewards and the user is not authenticated, return null
    if (item.name === "Profile" || item.name === "Rewards") {
      // if the user is authenticated or has link, return the nav link
      if (!isAuth || !item.link) return null;

      return (
        <NavLink
          to={item.link}
          key={item.display_name + index}
          className={({ isActive }) =>
            cn(
              "text-sm py-2 px-4 h-full",
              isActive
                ? "bg-primary-main text-secondary-light"
                : "hover:bg-secondary-light-2 transition-all",
              className
            )
          }
        >
          {item.display_name}
        </NavLink>
      );
    }

    // if the title is language, return the language button
    if (item.name === "Language") {
      return (
        <ToggleLanguage className={className} key={item.display_name + index}>
          {item.display_name}
        </ToggleLanguage>
      );
    }

    // at this point, the user is authenticated and the link is not login or register
    // if somehow the link is not defined, return null
    // this is a fallback in case the link is not defined
    if (!item.link) return null;

    // if none of the above, return the link
    return (
      <NavLink
        to={item.link}
        key={item.display_name + index}
        className={cn(
          "py-2 px-4 hover:bg-secondary-light-2",
          className
        )}
      >
        {item.display_name}
      </NavLink>
    );
  });
}
