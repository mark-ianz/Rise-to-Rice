import Footer from "./components/general/Footer";
import Header from "./components/header/Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import ScrollToHash from "./components/general/ScrollToHash";
import { Toaster } from "./components/ui/sonner";
import BackToTop from "./components/general/BackToTop";

function Layout() {
  return (
    <>
      <div className="pt-20">
        <Header />
        <main className="bg-warm-cream relative min-h-screen">
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
