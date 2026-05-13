import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: string | ReactNode;
  className?: string;
};

export default function HeaderText({ children, className }: Props) {
  return (
    <h2
      className={cn(
        "text-3xl font-roboto text-primary-main max-lg:text-2xl max-md:text-xl font-bold tracking-tight text-balance",
        className
      )}
    >
      {children}
    </h2>
  );
}
