import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login";
import { CreateAccountProvider } from "./context/CreateAccountContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext.tsx";
import Profile from "./pages/Profile.tsx";
import { EditProfileProvider } from "./context/EditProfileContext.tsx";
import Announcements from "./pages/Announcements.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import { FullUserProvider } from "./context/FullUserContext.tsx";
import RedeemRewards from "./pages/RedeemRewards.tsx";
import ProtectedRoute from "./components/protected/ProtectedRoute.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import DashboardLayout from "./components/page-components/dashboard/base/DashboardLayout.tsx";
import Users from "./pages/dashboard/Users.tsx";
import { SearchUserResultProvider } from "./context/SearchUserResultContext.tsx";
import ViewUser from "./pages/dashboard/ViewUser.tsx";
import { LogExchangeProvider } from "./context/LogExchangeContext.tsx";
import RedeemRequest from "./pages/dashboard/RedeemRequest.tsx";
import Rewards from "./pages/dashboard/Rewards.tsx";
import Material from "./pages/dashboard/Material.tsx";
import RedeemHistory from "./pages/RedeemHistory.tsx";
import ViewAnnouncement from "./pages/ViewAnnouncement.tsx";
import "./utils/i18n.ts";
import ContactMessages from "./pages/dashboard/ContactMessages.tsx";
import NotFoundPage from "./components/page-components/NotFoundPage.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";

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
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "register",
        element: (
          <ProtectedRoute role={"not authenticated"}>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <ProtectedRoute role={"not authenticated"}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute role={"user"}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "announcements",
        element: <Announcements />,
      },
      {
        path: "announcements/:id",
        element: <ViewAnnouncement />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "redeem-rewards",
        element: (
          <ProtectedRoute role={"user"}>
            <RedeemRewards />
          </ProtectedRoute>
        ),
      },
      {
        path: "redeem-history",
        element: (
          <ProtectedRoute role={"user"}>
            <RedeemHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <ProtectedRoute role={"not authenticated"}>
            <ForgotPassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "/dashboard/users",
            element: <Users />,
          },
          {
            path: "/dashboard/users/:id",
            element: <ViewUser />,
          },
          {
            path: "/dashboard/redeem-request",
            element: <RedeemRequest />,
          },
          {
            path: "/dashboard/rewards",
            element: <Rewards />,
          },
          {
            path: "/dashboard/materials",
            element: <Material />,
          },
          {
            path: "/dashboard/contact-messages",
            element: <ContactMessages />,
          },
        ],
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
