import { ReactNode } from "react";
import HeaderText from "@/components/general/HeaderText";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function SectionHeader({ children, className }: Props) {
  return (
    <div className={cn("bg-secondary-light-2 w-full h-28 max-lg:h-20 flex items-center px-20 max-md:px-10", className)}>
      <HeaderText>{children}</HeaderText>
    </div>
  );
}
