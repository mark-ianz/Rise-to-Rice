import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import UnitedStatesFlag from "../icons/UnitedStatesFlag";
import PhilippineFlag from "../icons/PhilippineFlag";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode | string;
  className?: string;
};

export default function ToggleLanguage({ children, className }: Props) {
  const { i18n } = useTranslation("header");

  const currentLanguage = {
    code: i18n.language,
    name: i18n.language === "en" ? "English" : "Tagalog",
    flag: i18n.language === "en" ? <UnitedStatesFlag /> : <PhilippineFlag />,
  };

  const toggleLanguageChange = () => {
    const newLanguage = currentLanguage.code === "en" ? "tl" : "en";
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("i18nextLng", newLanguage);
  };

  return (
    <Button
      onClick={toggleLanguageChange}
      variant={"ghost"}
      className={cn(
        "rounded-none py-2 font-normal px-4 h-full hover:bg-secondary-light-2 flex items-start justify-start cursor-pointer",
        className
      )}
      asChild
    >
      <span className="flex items-center">
        {children}: {currentLanguage.name}
        {currentLanguage.flag}
      </span>
    </Button>
  );
}
