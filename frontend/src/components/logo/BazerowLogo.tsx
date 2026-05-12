import bazerow_logo from "@/assets/bazerow_logo.png";
import { cn } from "@/lib/utils";

export default function BazerowLogo({
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
        src={bazerow_logo}
        alt="bazerow logo"
      />
    </div>
  );
}
