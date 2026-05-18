import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id: string;
  screen?: boolean;
};

export default function SectionWrapper({
  children,
  className,
  id,
  screen = true,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "flex flex-col flex-1 w-full bg-secondary-light-2",
        className,
        screen && "min-h-[calc(100dvh-80px)]"
      )}
    >
      {children}
    </section>
  );
}
