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
  // Defer loading the popup chunk until after hydration (it only
  // shows itself after 15s anyway) — identical behaviour, lighter first load.
  const [popupReady, setPopupReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setPopupReady(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

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
      {popupReady && (
        <Suspense fallback={null}>
          <NewsletterPopup />
        </Suspense>
      )}
    </div>
  );
};

export default Layout;
