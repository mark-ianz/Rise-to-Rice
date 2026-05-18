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
        <Button className="relative w-10 h-10 rounded-full border border-border/60 bg-white hover:bg-foreground/20 hover:shadow-sm transition-all flex items-center justify-center p-0 overflow-hidden group max-lg:w-8 max-lg:h-8">
          {isAuth ? (
            <div className="w-full h-full bg-gradient-to-br from-[#2D5A27] to-[#1E3B1A] flex items-center justify-center text-white font-bold text-sm max-lg:text-xs">
              {state.first_name.charAt(0).toUpperCase()}
              {state.last_name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[280px] p-0 overflow-hidden rounded-2xl shadow-xl border border-border/60 bg-white flex flex-col"
      >
        {isAuth && (
          <div className="flex flex-col">
            {/* Header / Greeting */}
            <div className="bg-gradient-to-r from-[#2D5A27] to-[#1a3816] px-5 py-4 text-white">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                {t("profile_popover.greetings")}
              </span>
              <div className="text-lg font-bold truncate mt-0.5 drop-shadow-sm leading-tight">
                {state.first_name} {state.last_name}
              </div>
              <div className="text-[11px] text-white/80 font-medium truncate mt-2 flex items-center gap-2">
                <span className="capitalize bg-white/20 border border-white/20 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider">
                  {state.role ? state.role.replace(/_/g, " ") : "User"}
                </span>
                <span className="truncate">{state.email}</span>
              </div>
            </div>

            {/* Points Section */}
            <div className="bg-[#FAF8F5] px-5 py-3 border-b border-border/50 flex flex-col gap-1.5">
              <Points className="text-sm font-semibold text-[#2D5A27]" />
            </div>
          </div>
        )}
        <div className="flex flex-col p-2 gap-1">
          <ProfileButtonLinks />
        </div>
      </PopoverContent>
    </Popover>
  );
}
