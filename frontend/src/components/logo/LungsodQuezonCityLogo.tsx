import { cn } from "@/lib/utils";
import LungsodQuezonCityLogo_pic from "@/assets/Lungzon Quezon City Logo.png";

export default function LungsodQuezonCityLogo({
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
        src={LungsodQuezonCityLogo_pic}
        alt="lungsod quezon city logo"
      />
    </div>
  );
}
