import DSQC_Logo from "@/assets/DSQC Logo.png";
import { cn } from "@/lib/utils";

export default function DSQCLogo({
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
        src={DSQC_Logo}
        alt="bazerow logo"
      />
    </div>
  );
}
