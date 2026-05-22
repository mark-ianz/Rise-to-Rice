import { useTranslation } from "react-i18next";
import { LinkType } from "../NavLinks";
import useUserContext from "@/hooks/useUserContext";
import { NavLink } from "react-router-dom";
import {
  HandHelping,
  Home,
  Info,
  LayoutDashboard,
  Megaphone,
  MessageCircleMore,
} from "lucide-react";
import ProfileButtonLinks from "../ProfileButtonLinks";
import { Separator } from "@/components/ui/separator";

const iconedLinks = [
  {
    url: "/",
    icon: <Home size={20} />,
  },
  {
    url: "/home",
    icon: <Home size={20} />,
  },
  {
    url: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    url: "/announcements",
    icon: <Megaphone size={20} />,
  },
  {
    url: "/redeem-rewards",
    icon: <HandHelping size={20} />,
  },
  {
    url: "/about-us",
    icon: <Info size={20} />,
  },
  {
    url: "/contact-us",
    icon: <MessageCircleMore size={20} />,
  },
];

export default function SidebarNavLinks() {
  const { t } = useTranslation("header");
  const { state } = useUserContext();

  const isAuth = !!state.account_id;
  const isAdmin = state?.isAdmin;

  const links = t(isAuth ? "authenticated_links" : "guest_links", {
    returnObjects: true,
  }) as LinkType[];

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <ol className="flex flex-col gap-1.5">
        {links.map((link) => {
          if (link.role === "admin" && !isAdmin) return null;
          if (link.role === "user" && !isAuth) return null;
          return <RenderLink key={link.name} link={link} />;
        })}
      </ol>
      <Separator className="bg-warm-tan/20" />
      <ol className="flex flex-col gap-1.5">
        <ProfileButtonLinks className="px-4 py-3.5 text-md rounded-2xl transition-all duration-300 text-secondary-dark/70 hover:bg-secondary-light-2/60 hover:text-secondary-dark" />
      </ol>
    </div>
  );
}

import { cn } from "@/lib/utils";

function RenderLink({ link }: { link: LinkType }) {
  return (
    <li key={link.name} className="flex w-full">
      <NavLink
        className={({ isActive }) =>
          cn(
            "w-full flex items-center gap-4 px-4 py-3.5 text-md font-medium rounded-2xl transition-all duration-300 group relative overflow-hidden",
            isActive
              ? "bg-[#2D5A27]/8 text-[#2D5A27] font-semibold"
              : "text-secondary-dark/70 hover:bg-secondary-light-2/60 hover:text-secondary-dark"
          )
        }
        to={link.url}
      >
        {({ isActive }) => (
          <>
            {/* Left accent bar for active link */}
            {isActive && (
              <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#2D5A27] rounded-r-full" />
            )}
            {iconedLinks.map((iconLink) =>
              iconLink.url === link.url ? (
                <span
                  key={iconLink.url}
                  className={cn(
                    "transition-all duration-300 group-hover:scale-110",
                    isActive ? "text-[#2D5A27]" : "text-secondary-dark/50 group-hover:text-secondary-dark"
                  )}
                >
                  {iconLink.icon}
                </span>
              ) : null
            )}
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              {link.name}
            </span>
          </>
        )}
      </NavLink>
    </li>
  );
}
