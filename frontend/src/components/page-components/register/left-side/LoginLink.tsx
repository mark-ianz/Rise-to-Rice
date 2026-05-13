import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function LoginLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-center", className)}>
      <Link
        to={"/login"}
        className="w-fit text-sm text-primary-main hover:text-primary-dark transition-colors max-xsm:text-xs"
      >
        {children}
      </Link>
    </span>
  );
}
