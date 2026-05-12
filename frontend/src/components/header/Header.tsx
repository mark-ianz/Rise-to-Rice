import { useState } from "react";
import BigScreenHeaderNavs from "./BigScreenHeaderNavs";
import HamburgerNav from "./HamburgerNav";
import LogoNav from "./LogoNav";
import Sidebar from "./sidebar/Sidebar";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-secondary-light px-20 fixed inset-0 h-28 z-50 items-center flex shadow-md max-xl:px-10 max-md:px-4">
      <div className="flex items-center justify-between grow gap-2">
        <LogoNav />
        <BigScreenHeaderNavs />
        <HamburgerNav setIsSidebarOpen={setIsSidebarOpen}/>
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      </div>
    </header>
  );
}
