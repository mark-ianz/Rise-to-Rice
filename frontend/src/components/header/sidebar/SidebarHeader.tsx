import SolidWasteManagement from "@/components/general/SolidWasteManagementProgram";
import CompanyLogo from "@/components/logo/CompanyLogo";
import TextLogo from "@/components/logo/TextLogo";

export default function SidebarHeader() {
  return (
    <div className="flex items-center gap-4 p-6">
      <CompanyLogo />
      <div>
        <TextLogo />
        <SolidWasteManagement />
      </div>
    </div>
  );
}
