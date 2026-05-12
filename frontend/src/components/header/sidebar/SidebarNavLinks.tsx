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

  const links = t("nav_links", { returnObjects: true }) as LinkType[];

  const isAuth = !!state.account_id;
  const isAdmin = state?.isAdmin;

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col">
        {links.map((link) => {
          if (link.role === "admin" && !isAdmin) return null;
          if (link.role === "user" && !isAuth) return null;
          return <RenderLink key={link.name} link={link} />;
        })}
      </ol>
      <Separator />
      <ol className="flex flex-col">
        <ProfileButtonLinks className="p-4 text-md max-md:text-sm" />
      </ol>
    </div>
  );
}

function RenderLink({ link }: { link: LinkType }) {
  return (
    <li
      key={link.name}
      className="text-secondary-dark text-md max-md:text-sm transition-all flex"
    >
      <NavLink
        className={({ isActive }) =>
          `${
            isActive
              ? "bg-primary-main text-secondary-light"
              : "hover:bg-secondary-light-2 transition-all"
          } flex items-center gap-4 p-4 w-full h-full`
        }
        to={link.url}
      >
        {iconedLinks.map((iconLink) =>
          iconLink.url === link.url ? (
            <span key={iconLink.url} className="">
              {iconLink.icon}
            </span>
          ) : null
        )}
        {link.name}
      </NavLink>
    </li>
  );
}
