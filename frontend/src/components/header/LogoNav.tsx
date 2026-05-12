import CompanyLogo from "../logo/CompanyLogo";
import TextLogo from "../logo/TextLogo";
import SolidWasteManagement from "../general/SolidWasteManagementProgram";
import { useNavigate } from "react-router-dom";

export default function LogoNav() {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <CompanyLogo />
      <span>
        <TextLogo />
        <SolidWasteManagement />
      </span>
    </div>
  );
}
