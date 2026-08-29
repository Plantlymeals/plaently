import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "@/lib/router-compat";
import Header from "./Header";
import Footer from "./Footer";

// The newsletter popup only appears after 15s and pulls in framer-motion,
// so it is code-split out of the initial page bundle.
const NewsletterPopup = lazy(() => import("./NewsletterPopup"));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <NewsletterPopup />
    </div>
  );
};

export default Layout;
