import SectionWrapper from "@/components/general/SectionWrapper";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id: string;
};

export default function AuthPageLayout({ children, className, id }: Props) {
  return (
    <div
      id={id}
      className={cn(
        "relative isolate flex w-full h-screen bg-white",
        className
      )}
    >
      {children}
    </div>
  );
}
