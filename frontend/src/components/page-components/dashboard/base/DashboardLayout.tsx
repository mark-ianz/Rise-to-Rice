import ProtectedRoute from "@/components/protected/ProtectedRoute";
import { Outlet } from "react-router-dom";
import AsideNav from "../AsideNav";
import { Helmet } from "react-helmet";

export default function DashboardLayout() {
  return (
    <ProtectedRoute role={"admin"}>
      <AsideNav />
      <div className="pl-64 max-lg:pl-0">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
}
