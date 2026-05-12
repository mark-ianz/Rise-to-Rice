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
      <div
        className={cn(
          "top-0 left-0 right-0 bottom-0 bg-black/40 z-[99]",
          isSidebarOpen ? "fixed" : "hidden"
        )}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div
        className={cn(
          " fixed bg-secondary-light inset-y-0 left-0 w-[90vw] max-w-[500px] z-[100]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <aside className="flex flex-col relative">
          <CloseSidebarButton setIsSidebarOpen={setIsSidebarOpen} />
          <SidebarHeader />
          <Separator />
          <SidebarNavLinks />
        </aside>
      </div>
    </>
  );
}
