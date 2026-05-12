import barangay_silangan_logo from "@/assets/barangay_silangan_logo.png";
import { cn } from "@/lib/utils";

export default function BarangaySilanganLogo({
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
        src={barangay_silangan_logo}
        alt="barangay silangan logo"
      />
    </div>
  );
}
