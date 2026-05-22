import { cn } from "@/lib/utils";
import { Separator } from "../../ui/separator";
import { useEffect } from "react";
import CloseSidebarButton from "./CloseSidebarButton";
import SidebarNavLinks from "./SidebarNavLinks";
import { useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const location = useLocation();

  // Close the sidebar when the user navigates to a new page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname, setIsSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <>
      {/* Smoothly fading & blurring backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/45 backdrop-blur-[4px] z-[99] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Spring-like sliding drawer */}
      <div
        className={cn(
          "fixed bg-secondary-light inset-y-0 left-0 w-[85vw] max-w-[360px] z-[100] rounded-r-[2rem] border-r border-warm-tan/10 shadow-[10px_0_50px_rgba(0,0,0,0.12)]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        )}
      >
        <aside className="flex flex-col relative h-full overflow-y-auto">
          <CloseSidebarButton setIsSidebarOpen={setIsSidebarOpen} />
          <SidebarHeader />
          <Separator className="bg-warm-tan/20" />
          <SidebarNavLinks />
        </aside>
      </div>
    </>
  );
}
