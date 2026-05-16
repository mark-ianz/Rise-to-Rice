import CompanyLogo from "../logo/CompanyLogo";
import TextLogo from "../logo/TextLogo";
import SolidWasteManagement from "../general/SolidWasteManagementProgram";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function LogoNav({ className, rightLogo }: { className?: string, rightLogo?: boolean }) {
  const navigate = useNavigate();
  return (
    <div
      className={cn("flex items-center justify-center gap-2 cursor-pointer", className, rightLogo ? "justify-end flex-row-reverse" : "justify-start")}
      onClick={() => navigate("/")}
    >
      <CompanyLogo containerClass="w-10 h-10" />
      <span className={cn("flex flex-col", rightLogo ? "items-end" : "items-start")}>
        <TextLogo className="text-xl font-bold leading-none" />
        <SolidWasteManagement className="text-[10px] opacity-80" />
      </span>
    </div>
  );
}
