import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  subtitle?: string;
};

export default function SectionHeader({ children, className, subtitle }: Props) {
  return (
    <div className={cn("text-center mb-16 max-md:mb-12", className)}>
      {subtitle && (
        <span className="text-primary-main text-sm font-semibold uppercase tracking-wider">
          {subtitle}
        </span>
      )}
      <h2 className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-secondary-dark">
        {children}
      </h2>
    </div>
  );
}
