import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CenterLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-full flex flex-col justify-center", className)}>
      {children}
    </div>
  );
}
