import CompanyLogo from "../logo/CompanyLogo";
import TextLogo from "../logo/TextLogo";
import SolidWasteManagement from "../general/SolidWasteManagementProgram";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function LogoNav({ className }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <div
      className={cn("flex items-center gap-2 cursor-pointer", className)}
      onClick={() => navigate("/")}
    >
      <span className="flex flex-col items-end">
        <TextLogo className="text-xl font-bold leading-none" />
        <SolidWasteManagement className="text-[10px] opacity-80" />
      </span>
      <CompanyLogo containerClass="w-10 h-10" />
    </div>
  );
}
