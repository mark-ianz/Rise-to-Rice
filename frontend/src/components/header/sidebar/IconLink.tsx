import { useTranslation } from "react-i18next";
import { LinkType } from "../NavLinks";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  link: {
    url: string;
    icon: JSX.Element;
  };
};

export default function IconLink({ link }: Props) {
  const { t } = useTranslation("header");

  const links = t("nav_links", { returnObjects: true }) as LinkType[];

  return (
    <li
      className={cn(
        "bg-secondary-light-dark text-secondary-light rounded-md aspect-square flex items-center justify-center text-md max-md:text-sm hover:scale-105 transition-all"
      )}
    >
      <NavLink
        className={({ isActive }) =>
          cn(
            "hover:text-secondary-light-2 rounded-md flex items-center justify-center w-full h-full",
            isActive &&
              "bg-secondary-light text-secondary-light-dark border-solid border-secondary-light-dark border-2"
          )
        }
        to={link.url}
      >
        <div className="flex flex-col items-center justify-center">
          {link.icon}
          {links?.map(
            (tLink, index) =>
              tLink.url === link.url && (
                <p key={`${tLink.name}-${index}`}>{tLink.name}</p>
              )
          )}
        </div>
      </NavLink>
    </li>
  );
}
