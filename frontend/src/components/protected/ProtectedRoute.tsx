import useUserContext from "@/hooks/useUserContext";
import { ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Role } from "@/types/user.type";

type Props = {
  children?: ReactNode;
  role: Role | "not authenticated";
};

export default function ProtectedRoute({ children, role }: Props) {
  const { state, isLoading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (role === "not authenticated" && state?.user_id) {
      navigate("/");
    }
    if (role === "user" && !state?.user_id) {
      navigate("/");
    }
    if ((role === "admin" || role === "super_admin") && !state?.isAdmin) {
      navigate("/");
    }
  }, [state, role, isLoading, navigate]);

  const isRedirecting =
    (role === "not authenticated" && state?.user_id) ||
    (role === "user" && !state?.user_id) ||
    ((role === "admin" || role === "super_admin") && !state?.isAdmin);

  if (isRedirecting) return null;

  return <>{children || <Outlet />}</>;
}
