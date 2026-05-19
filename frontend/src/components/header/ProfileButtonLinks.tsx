import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import useLogout from "@/hooks/useLogout";
import useFullUserContext from "@/hooks/useFullUserContext";
import { useTranslation } from "react-i18next";
import ToggleLanguage from "./ToggleLanguage";
import { cn } from "@/lib/utils";
import { User, LogOut, LogIn, UserPlus, Gift, Globe } from "lucide-react";

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

  const getIcon = (name: string) => {
    switch (name) {
      case "Profile": return <User size={16} />;
      case "Rewards": return <Gift size={16} />;
      case "Language": return <Globe size={16} />;
      case "Logout": return <LogOut size={16} />;
      case "Login": return <LogIn size={16} />;
      case "Register": return <UserPlus size={16} />;
      default: return null;
    }
  };

  const itemClass = "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-secondary-light/60 transition-colors text-foreground";
  const activeClass = "bg-[#2D5A27]/8 text-[#2D5A27] font-semibold hover:bg-[#2D5A27]/12";

  return popoverContent.map((item, index) => {
    // if the link is login or register and the user is authenticated, return null
    if (item.name === "Login" || item.name === "Register") {
      if (isAuth || !item.link) return null;
      return (
        <Link
          to={item.link}
          key={item.display_name + index}
          className={cn(itemClass, className)}
        >
          {getIcon(item.name)}
          {item.display_name}
        </Link>
      );
    }

    // if the link is logout and the user is not authenticated, return null
    if (item.name === "Logout" && isAuth) {
      return (
        <Button
          onClick={logout}
          variant="ghost"
          key={item.display_name + index}
          className={cn(
            itemClass,
            "h-auto hover:text-red-600 hover:bg-red-50",
            className
          )}
        >
          {getIcon(item.name)}
          {item.display_name}
        </Button>
      );
    }

    // if the link is profile or rewards and the user is not authenticated, return null
    if (item.name === "Profile" || item.name === "Rewards") {
      if (!isAuth || !item.link) return null;
      return (
        <NavLink
          to={item.link}
          key={item.display_name + index}
          className={({ isActive }) => cn(itemClass, isActive && activeClass, className)}
        >
          {getIcon(item.name)}
          {item.display_name}
        </NavLink>
      );
    }

    // if the title is language, return the language button
    if (item.name === "Language") {
      return (
        <ToggleLanguage 
          className={cn(itemClass, "h-auto", className)} 
          key={item.display_name + index}
        >
          <span className="flex items-center gap-3">
            {getIcon(item.name)}
            {item.display_name}
          </span>
        </ToggleLanguage>
      );
    }

    // generic fallback
    if (!item.link) return null;
    return (
      <NavLink
        to={item.link}
        key={item.display_name + index}
        className={({ isActive }) => cn(itemClass, isActive && activeClass, className)}
      >
        {getIcon(item.name)}
        {item.display_name}
      </NavLink>
    );
  });
}
