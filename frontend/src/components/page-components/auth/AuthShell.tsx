import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hero: ReactNode;
  className?: string;
  contentClassName?: string;
  heroClassName?: string;
};

export default function AuthShell({
  children,
  hero,
  className,
  contentClassName,
  heroClassName,
}: Props) {
  return (
    <div
      className={cn(
        "relative isolate w-full min-h-screen bg-white flex flex-col lg:flex-row",
        className
      )}
    >
      <div
        className={cn(
          "order-1 lg:order-1 flex-1 flex flex-col min-h-screen",
          heroClassName
        )}
      >
        {hero}
      </div>
      <div className={cn("order-2 lg:order-2 flex-1 flex flex-col min-h-screen", contentClassName)}>{children}</div>
    </div>
  );
}
