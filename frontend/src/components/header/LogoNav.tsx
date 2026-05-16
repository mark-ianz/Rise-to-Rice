import CompanyLogo from "../logo/CompanyLogo";
import TextLogo from "../logo/TextLogo";
import SolidWasteManagement from "../general/SolidWasteManagementProgram";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import useUserContext from "@/hooks/useUserContext";

export default function LogoNav({ className, rightLogo }: { className?: string, rightLogo?: boolean }) {
  const navigate = useNavigate();
  const { state } = useUserContext();
  const isAuth = !!state.account_id;
  const isAdmin = state?.isAdmin;

  return (
    <div
      className={cn("flex items-center justify-center gap-2 cursor-pointer", className, rightLogo ? "justify-end flex-row-reverse" : "justify-start")}
      onClick={() => navigate(isAuth ? "/home" : "/")}
    >
      <CompanyLogo containerClass="w-10 h-10" />
      <span className={cn("flex flex-col", rightLogo ? "items-end" : "items-start")}>
        <TextLogo className="text-xl font-bold leading-none" />
        <SolidWasteManagement className="text-[10px] opacity-80" />
      </span>
    </div>
  );
}
