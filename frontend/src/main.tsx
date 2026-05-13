import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.tsx";
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { CreateAccountProvider } from "./context/CreateAccountContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext.tsx";
import { EditProfileProvider } from "./context/EditProfileContext.tsx";
import { FullUserProvider } from "./context/FullUserContext.tsx";
import ProtectedRoute from "./components/protected/ProtectedRoute.tsx";
import { SearchUserResultProvider } from "./context/SearchUserResultContext.tsx";
import { LogExchangeProvider } from "./context/LogExchangeContext.tsx";
import "./utils/i18n.ts";
import NotFoundPage from "./components/page-components/NotFoundPage.tsx";
import WholePageLoader from "./components/general/WholePageLoader.tsx";

const LandingPage = lazy(() => import("./pages/LandingPage.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Announcements = lazy(() => import("./pages/Announcements.tsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.tsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.tsx"));
const RedeemRewards = lazy(() => import("./pages/RedeemRewards.tsx"));
const RedeemHistory = lazy(() => import("./pages/RedeemHistory.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ViewAnnouncement = lazy(() => import("./pages/ViewAnnouncement.tsx"));
const DashboardLayout = lazy(
  () => import("./components/page-components/dashboard/base/DashboardLayout.tsx")
);
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.tsx"));
const Users = lazy(() => import("./pages/dashboard/Users.tsx"));
const ViewUser = lazy(() => import("./pages/dashboard/ViewUser.tsx"));
const RedeemRequest = lazy(() => import("./pages/dashboard/RedeemRequest.tsx"));
const Rewards = lazy(() => import("./pages/dashboard/Rewards.tsx"));
const Material = lazy(() => import("./pages/dashboard/Material.tsx"));
const ContactMessages = lazy(
  () => import("./pages/dashboard/ContactMessages.tsx")
);

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<WholePageLoader />}>{element}</Suspense>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(<LandingPage />),
      },
      {
        path: "register",
        element: (
          <ProtectedRoute role={"not authenticated"}>
            {withSuspense(<Register />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <ProtectedRoute role={"not authenticated"}>
            {withSuspense(<Login />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute role={"user"}>
            {withSuspense(<Profile />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "announcements",
        element: withSuspense(<Announcements />),
      },
      {
        path: "announcements/:id",
        element: withSuspense(<ViewAnnouncement />),
      },
      {
        path: "about-us",
        element: withSuspense(<AboutUs />),
      },
      {
        path: "contact-us",
        element: withSuspense(<ContactUs />),
      },
      {
        path: "redeem-rewards",
        element: (
          <ProtectedRoute role={"user"}>
            {withSuspense(<RedeemRewards />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "redeem-history",
        element: (
          <ProtectedRoute role={"user"}>
            {withSuspense(<RedeemHistory />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <ProtectedRoute role={"not authenticated"}>
            {withSuspense(<ForgotPassword />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: withSuspense(<DashboardLayout />),
        children: [
          {
            index: true,
            element: withSuspense(<Dashboard />),
          },
          {
            path: "/dashboard/users",
            element: withSuspense(<Users />),
          },
          {
            path: "/dashboard/users/:id",
            element: withSuspense(<ViewUser />),
          },
          {
            path: "/dashboard/redeem-request",
            element: withSuspense(<RedeemRequest />),
          },
          {
            path: "/dashboard/rewards",
            element: withSuspense(<Rewards />),
          },
          {
            path: "/dashboard/materials",
            element: withSuspense(<Material />),
          },
          {
            path: "/dashboard/contact-messages",
            element: withSuspense(<ContactMessages />),
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <FullUserProvider>
        <CreateAccountProvider>
          <EditProfileProvider>
            <SearchUserResultProvider>
              <LogExchangeProvider>
                <RouterProvider router={router} />
              </LogExchangeProvider>
            </SearchUserResultProvider>
          </EditProfileProvider>
        </CreateAccountProvider>
      </FullUserProvider>
    </UserProvider>
  </QueryClientProvider>
);
