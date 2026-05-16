import useUserContext from "@/hooks/useUserContext";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export type LinkType = {
  name: string;
  url: string;
  role?: string;
};

export default function NavLinks() {
  const { t } = useTranslation("header");
  const { state } = useUserContext();

  const links = t("nav_links", { returnObjects: true }) as LinkType[];

  const isAuth = !!state.account_id;
  const isAdmin = state?.isAdmin;

  return (
    <ol className="flex gap-6 max-xl:gap-4">
      {links.map((link) => {
        if (link.role === "admin" && !isAdmin) return null;
        if (link.role === "user" && !isAuth) return null;

        let finalUrl = link.url;
        if (isAuth && link.url === "/") {
          finalUrl = "/home";
        }

        return <RenderLink key={link.name} link={{ ...link, url: finalUrl }} />;
      })}
    </ol>
  );
}

function RenderLink({ link }: { link: LinkType }) {
  return (
    <li
      key={link.name}
      className="text-secondary-dark/80 text-sm font-medium tracking-wide uppercase"
    >
      <NavLink
        className="hover:text-primary-main transition-colors duration-200 py-2"
        to={link.url}
      >
        {link.name}
      </NavLink>
    </li>
  );
}
