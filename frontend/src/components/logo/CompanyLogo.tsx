import { cn } from "@/lib/utils";
import company_logo from "../../assets/COMPONY LOGO NO BG.png";

export default function CompanyLogo({
  imgClass,
  containerClass,
}: {
  imgClass?: string;
  containerClass?: string;
}) {
  return (
    <div className={cn("w-20", containerClass)}>
      <img
        className={cn(imgClass, "w-full h-auto")}
        src={company_logo}
        alt="barangay silangan solid waste management logo"
      />
    </div>
  );
}
