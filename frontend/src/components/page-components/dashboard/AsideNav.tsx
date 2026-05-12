import AsideNavLinks from "@/components/header/AsideNavLinks";
import {
  HandHelping,
  LucideLayoutDashboard,
  MessageCircleQuestion,
  Milk,
  Send,
  User2,
} from "lucide-react";

export default function AsideNav() {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LucideLayoutDashboard className="max-lg:w-5" />,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <User2 className="max-lg:w-5" />,
    },
    {
      name: "Redeem Request",
      path: "/dashboard/redeem-request",
      icon: <Send className="max-lg:w-5" />,
    },
    {
      name: "Rewards",
      path: "/dashboard/rewards",
      icon: <HandHelping className="max-lg:w-5" />,
    },
    {
      name: "Materials",
      path: "/dashboard/materials",
      icon: <Milk className="max-lg:w-5" />,
    },
    {
      name: "Contact Messages",
      path: "/dashboard/contact-messages",
      icon: <MessageCircleQuestion className="max-lg:w-5" />,
    },
  ];

  return (
    <aside className="absolute top-0 shadow-lg w-64 bottom-0 max-lg:text-sm max-lg:static max-lg:w-full">
      <nav>
        <ul>
          {links.map((link) => (
            <AsideNavLinks link={link} key={link.name} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
