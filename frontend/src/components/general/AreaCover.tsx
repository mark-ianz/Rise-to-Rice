import { cn } from "@/lib/utils";

export default function AreaCover({ className }: { className?: string }) {
  return (
    <span
      className={cn("absolute inset-0 bg-secondary-light-2/80", className)}
    ></span>
  );
}
