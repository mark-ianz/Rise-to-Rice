import { cn } from "@/lib/utils";

export default function SolidWasteManagement({
  className,
}: {
  className?: string;
}) {
  return (
    <p className={cn("-mt-1 text-secondary-dark text-xs max-xsm:text-[11px]", className)}>
      SOLID WASTE MANAGEMENT PROGRAM
    </p>
  );
}
