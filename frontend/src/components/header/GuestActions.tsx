import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useTranslation } from "react-i18next";
import { LogIn, UserPlus, ChevronDown } from "lucide-react";
import useFullUserContext from "@/hooks/useFullUserContext";
import axios from "axios";
import UnitedStatesFlag from "../icons/UnitedStatesFlag";
import PhilippineFlag from "../icons/PhilippineFlag";

const itemClass =
  "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl hover:bg-[#2D5A27]/8 text-secondary-dark/80 hover:text-[#2D5A27] transition-all duration-200 cursor-pointer";

export default function GuestActions() {
  const { t, i18n } = useTranslation("header");
  const { state: fullUser } = useFullUserContext();

  const currentLanguage = i18n.language;
  const FlagIcon = currentLanguage === "en" ? UnitedStatesFlag : PhilippineFlag;

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === "en" ? "tl" : "en";
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("i18nextLng", newLanguage);

    if (fullUser?.user_id) {
      try {
        await axios.put("/api/user/preferred-language", {
          preferred_language: newLanguage,
        });
      } catch (error) {
        console.error("Failed to update preferred language in database:", error);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative flex items-center gap-2 bg-primary-main text-white hover:bg-primary-main-dark rounded-full px-5 h-10 text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 group">
          <UserPlus size={17} />
          <span>Join</span>
          <ChevronDown
            size={14}
            className="transition-transform duration-300 group-data-[state=open]:rotate-180"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[220px] p-2 rounded-2xl shadow-lg border border-warm-tan/30 bg-white"
      >
        <div className="flex flex-col gap-0.5">
          <Link to="/login" className={itemClass}>
            <span className="w-8 h-8 rounded-lg bg-[#2D5A27]/8 flex items-center justify-center shrink-0">
              <LogIn size={16} className="text-[#2D5A27]" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-secondary-dark">{t("login")}</span>
              <span className="text-[11px] text-muted-foreground">Sign into your account</span>
            </span>
          </Link>
          <Link to="/register" className={itemClass}>
            <span className="w-8 h-8 rounded-lg bg-[#2D5A27]/8 flex items-center justify-center shrink-0">
              <UserPlus size={16} className="text-[#2D5A27]" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-secondary-dark">{t("register")}</span>
              <span className="text-[11px] text-muted-foreground">Create a new account</span>
            </span>
          </Link>
          <hr className="my-1 border-warm-tan/20" />
          <button onClick={toggleLanguage} className={itemClass}>
            <span className="w-8 h-8 rounded-lg bg-[#2D5A27]/8 flex items-center justify-center shrink-0">
              <span className="w-4 h-4 rounded-sm overflow-hidden border border-border/40 flex items-center justify-center">
                <FlagIcon />
              </span>
            </span>
            <span className="flex flex-col leading-tight flex-1">
              <span className="font-semibold text-sm text-secondary-dark">
                {currentLanguage === "en" ? "English" : "Tagalog"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {currentLanguage === "en" ? "Switch to Tagalog" : "Switch to English"}
              </span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider bg-secondary-light-2/50 px-2 py-0.5 rounded-md">
              {currentLanguage === "en" ? "EN" : "TL"}
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
