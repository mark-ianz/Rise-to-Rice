import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  head: string;
  children?: ReactNode;
  value?: string | number;
  className?: string;
  headClassName?: string;
  valueClassName?: string;
};

export default function KeyValuePair({
  head,
  children,
  value,
  className,
  headClassName,
  valueClassName,
}: Props) {
  return (
    <span className={cn("flex flex-col", className, headClassName)}>
      <p className={cn("text-tertiary -mb-1 text-sm", headClassName)}>{head}</p>
      {children}
      {value && <p className={cn(valueClassName)}>{value}</p>}
    </span>
  );
}
