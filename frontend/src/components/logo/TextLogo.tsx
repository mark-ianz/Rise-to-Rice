import { cn } from "@/lib/utils";

export default function TextLogo({ className }: { className?: string }) {
  return (
    <p className={cn("font-coiny text-primary-main text-2xl max-xsm:text-xl", className)}>
      RISE TO RICE
    </p>
  );
}
