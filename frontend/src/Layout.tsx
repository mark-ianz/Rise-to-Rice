import Footer from "./components/general/Footer";
import Header from "./components/header/Header";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import ScrollToHash from "./components/general/ScrollToHash";
import { Toaster } from "./components/ui/sonner";
import BackToTop from "./components/general/BackToTop";
import { useMemo } from "react";

function Layout() {
  const location = useLocation();
  
  const isAuthPage = useMemo(() => {
    return ["/login", "/register", "/forgot-password"].includes(location.pathname);
  }, [location.pathname]);

  if (isAuthPage) {
    return (
      <main className="relative min-h-screen">
        <Outlet />
        <Toaster />
      </main>
    );
  }

  return (
    <>
      <div className="pt-20">
        <Header />
        <main className="bg-warm-cream relative min-h-screen flex flex-col">
          <Outlet />
          <ScrollRestoration />
          <ScrollToHash />
          <BackToTop />
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default Layout;
