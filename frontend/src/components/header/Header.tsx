import { useState } from "react";
import BigScreenHeaderNavs from "./BigScreenHeaderNavs";
import HamburgerNav from "./HamburgerNav";
import LogoNav from "./LogoNav";
import Sidebar from "./sidebar/Sidebar";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md px-20 fixed inset-0 h-20 z-50 items-center flex border-b border-warm-tan/30 max-xl:px-10 max-md:px-6">
        <div className="flex items-center justify-between grow gap-4 max-w-screen-2xl mx-auto w-full">
          <LogoNav />
          <BigScreenHeaderNavs />
          <HamburgerNav setIsSidebarOpen={setIsSidebarOpen}/>
        </div>
      </header>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
    </>
  );
}
