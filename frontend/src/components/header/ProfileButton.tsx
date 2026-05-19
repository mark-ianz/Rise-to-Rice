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
        <Button className="relative w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] shrink-0 ring-2 ring-[#2D5A27]/5 border border-[#2D5A27]/20 hover:scale-105 hover:bg-[#2D5A27]/15 hover:shadow-sm transition-all duration-300 p-0 overflow-hidden group max-lg:w-8 max-lg:h-8 cursor-pointer shadow-sm">
          {isAuth ? (
            <span className="font-semibold text-sm max-lg:text-xs tracking-tight">
              {state.first_name.charAt(0).toUpperCase()}
              {state.last_name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[280px] p-0 overflow-hidden rounded-2xl shadow-xl border border-border/60 bg-white flex flex-col relative"
      >
        {isAuth && (
          <div className="flex flex-col">
            {/* Header / Greeting - Styled like ViewProfile */}
            <div className="relative pt-6 px-5 pb-4 flex flex-col gap-3 border-b border-border/40">
              {/* Decorative Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27]/30 via-[#2D5A27] to-[#2D5A27]/50"></div>
              
              <div className="flex items-center gap-3">
                {/* Avatar with ring effect */}
                <div className="h-12 w-12 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] shrink-0 ring-4 ring-[#2D5A27]/5 border border-[#2D5A27]/20">
                  <span className="text-sm font-light tracking-tight">
                    {state.first_name.charAt(0).toUpperCase()}
                    {state.last_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Details */}
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-widest leading-none">
                    {t("profile_popover.greetings")}
                  </span>
                  <div className="text-base font-light text-foreground truncate mt-1">
                    {state.first_name} {state.last_name}
                  </div>
                </div>
              </div>

              {/* Sub-details (Role & Email) */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
                <span className="inline-flex text-[9px] px-2 py-0.5 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] border border-[#2D5A27]/20 font-semibold uppercase tracking-wider">
                  {state.role ? state.role.replace(/_/g, " ") : "User"}
                </span>
                <span className="truncate text-muted-foreground/80">{state.email}</span>
              </div>
            </div>

            {/* Points Section */}
            <div className="bg-[#FAF8F5] px-5 py-3 border-b border-border/40 flex flex-col gap-1.5">
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
