import { NavLink } from "react-router-dom";

type Props = {
  link: {
    name: string;
    path: string;
    icon: JSX.Element;
  };
};

export default function AsideNavLinks({ link }: Props) {
  return (
    <li>
      <NavLink
        to={link.path}
        end={link.path === "/dashboard"}
        className={({ isActive }) =>
          `${
            isActive
              ? "bg-primary-main text-secondary-light"
              : "hover:bg-secondary-light-2 transition-all"
          } flex items-center gap-4 p-4`
        }
      >
        {link.icon}
        {link.name}
      </NavLink>
    </li>
  );
}
