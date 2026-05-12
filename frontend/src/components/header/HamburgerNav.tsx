import { Menu } from "lucide-react";

export default function HamburgerNav({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="cursor-pointer hidden max-lg:block" onClick={() => setIsSidebarOpen(true)}>
      <Menu />
    </div>
  );
}

// install shadcn sidebar and figure ts out burhhh
