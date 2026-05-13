import { ReactNode } from "react";
import HeaderText from "@/components/general/HeaderText";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function SectionHeader({ children, className }: Props) {
  return (
    <div className={cn("bg-secondary-light-2 w-full h-28 max-lg:h-24 max-md:h-20 flex items-center px-20 max-lg:px-10 max-sm:px-6 border-b border-primary-main/10", className)}>
      <HeaderText className="text-3xl max-lg:text-2xl max-md:text-xl font-semibold">{children}</HeaderText>
    </div>
  );
}
