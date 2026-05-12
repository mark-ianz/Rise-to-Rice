import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function LoginLink({ children }: { children: ReactNode }) {
  return (
    <span className="text-center">
      <Link to={"/login"} className="text-sm text-tertiary w-fit max-xsm:text-xs">
        {children}
      </Link>
    </span>
  );
}
