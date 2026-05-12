import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: string | ReactNode;
  className?: string;
};

export default function HeaderText({ children, className }: Props) {
  return (
    <p
      className={cn(
        "text-3xl font-roboto text-primary-main max-lg:text-2xl max-md:text-xl",
        className
      )}
    >
      {children}
    </p>
  );
}
