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
        return <RenderLink key={link.name} link={link} />;
      })}
    </ol>
  );
}

function RenderLink({ link }: { link: LinkType }) {
  return (
    <li
      key={link.name}
      className="text-secondary-dark text-md max-md:text-sm hover:scale-105 transition-all"
    >
      <NavLink
        className="hover:text-tertiary hover:border-b border-b-tertiary"
        to={link.url}
      >
        {link.name}
      </NavLink>
    </li>
  );
}
