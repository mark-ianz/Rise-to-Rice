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
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";
import i18next from "i18next";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const lang = i18next.language || localStorage.getItem("i18nextLng") || "en";
  config.headers["Accept-Language"] = lang;
  return config;
});


const LandingPage = lazy(() => import("./pages/LandingPage.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Announcements = lazy(() => import("./pages/Announcements.tsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.tsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.tsx"));
const RedeemRewards = lazy(() => import("./pages/RedeemRewards.tsx"));
const RedeemHistory = lazy(() => import("./pages/RedeemHistory.tsx"));
const ActivityHistory = lazy(() => import("./pages/ActivityHistory.tsx"));
const ActivityHistoryRedeem = lazy(() => import("./pages/ActivityHistoryRedeem.tsx"));
const ActivityHistoryExchange = lazy(() => import("./pages/ActivityHistoryExchange.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ViewAnnouncement = lazy(() => import("./pages/ViewAnnouncement.tsx"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const UserHome = lazy(() => import("./pages/UserHome.tsx"));
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
        element: (
          <ProtectedRoute role="not authenticated">
            {withSuspense(<LandingPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute role={"user"}>
            {withSuspense(<UserHome />)}
          </ProtectedRoute>
        ),
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
        path: "announcements/:id/:slug?",
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
        path: "activity-history",
        element: (
          <ProtectedRoute role={"user"}>
            {withSuspense(<ActivityHistory />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "activity-history/redeem/:id",
        element: (
          <ProtectedRoute role={"user"}>
            {withSuspense(<ActivityHistoryRedeem />)}
          </ProtectedRoute>
        ),
      },
      {
        path: "activity-history/exchange/:id",
        element: (
          <ProtectedRoute role={"user"}>
            {withSuspense(<ActivityHistoryExchange />)}
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
        path: "terms-and-conditions",
        element: withSuspense(<TermsAndConditions />),
      },
      {
        path: "privacy-policy",
        element: withSuspense(<PrivacyPolicy />),
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
                <HelmetProvider>
                  <RouterProvider router={router} />
                </HelmetProvider>
              </LogExchangeProvider>
            </SearchUserResultProvider>
          </EditProfileProvider>
        </CreateAccountProvider>
      </FullUserProvider>
    </UserProvider>
  </QueryClientProvider>
);
