import { useEffect } from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  Link,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { useCartSync } from "@/hooks/useCartSync";
import LegacyQueryRedirect from "@/components/LegacyQueryRedirect";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import AiAssistant from "@/components/AiAssistant";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { clearChunkReloadGuard, reloadOnceForChunkError } from "@/lib/chunkReload";
import { getPathLocale } from "@/lib/localeAlternates";
import appCss from "../styles.css?url";

// ported from main.tsx — recover from stale chunk errors after a new deploy by reloading once.
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => reloadOnceForChunkError(e.error || e.message));
  window.addEventListener("unhandledrejection", (e) => reloadOnceForChunkError(e.reason));
  window.addEventListener("load", () => {
    setTimeout(clearChunkReloadGuard, 2000);
  });
}

const GA_LOADER = `(function () {
  var loaded = false;
  function loadGA() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WMLNNYVRSX';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-WMLNNYVRSX');
  }
  function hasAnalyticsConsent() {
    try {
      var raw = localStorage.getItem('plaently_cookie_consent_v1');
      return !!raw && JSON.parse(raw).analytics === true;
    } catch (e) { return false; }
  }
  var armed = false;
  var events = ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'];
  function trigger() {
    events.forEach(function (e) { window.removeEventListener(e, trigger, { passive: true }); });
    loadGA();
  }
  function arm() {
    if (armed || !hasAnalyticsConsent()) return;
    armed = true;
    events.forEach(function (e) { window.addEventListener(e, trigger, { passive: true, once: true }); });
  }
  window.addEventListener('plaently-consent-change', arm);
  arm();
})();`;

const ORG_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PLÄNTLY AB",
  legalName: "PLÄNTLY AB",
  alternateName: ["Plaently", "Plantly", "PLAENTLY", "Pläntly"],
  url: "https://plaently.com",
  logo: "https://plaently.com/images/logo.png",
  email: "hello@plaently.com",
  description:
    "Riktiga måltider med 20g protein — inget pulver, ingen shake. Klart på 5 minuter.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vretensborgsvägen 5",
    postalCode: "126 30",
    addressLocality: "Hägersten",
    addressCountry: "SE",
  },
  sameAs: [
    "https://www.instagram.com/plaently",
    "https://www.tiktok.com/@plaently",
    "https://www.linkedin.com/company/111443346/",
    "https://www.facebook.com/plaently",
  ],
});

const WEBSITE_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PLÄNTLY",
  alternateName: ["Plaently", "Plantly", "Pläntly"],
  url: "https://plaently.com",
  inLanguage: ["sv-SE", "en-GB"],
  publisher: { "@type": "Organization", name: "PLÄNTLY", url: "https://plaently.com" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://plaently.com/products?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
});

const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9e767189-eb55-4625-a33e-6e7fd5ef1e34/id-preview-0c6ffa32--e49a6c76-e3de-462b-a409-874125bebed1.lovable.app-1773245481620.png";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      {
        name: "google-site-verification",
        content: "Tth0Q_DkfhDNkjwXNN7UiHJsK6YgyqEXyqCMhhwvmKs",
      },
      {
        name: "google-site-verification",
        content: "ICbt45DRfDMGs_afjB4LHhFssxqiw0sff0R5fc9Vnk0",
      },
      {
        name: "keywords",
        content:
          "växtbaserade proteinmåltider, proteinmåltider, hälsosam snabbmat, 20g växtprotein, nyttig snabbmat Sverige, instant proteinmåltid, plant-based protein Sweden, PLÄNTLY, snabb proteinrik mat, växtprotein måltid",
      },
      { name: "author", content: "PLÄNTLY" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PLÄNTLY" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico?v=4", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png?v=4" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=4" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=4" },
      { rel: "preload", as: "image", href: "/images/logo.png", fetchPriority: "high" },
      {
        rel: "preload",
        as: "image",
        href: "/images/hero-product.webp",
        fetchPriority: "high",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preconnect",
        href: "https://fpwwjbevjhxbggtkaabc.supabase.co",
        crossOrigin: "anonymous",
      },
      { rel: "dns-prefetch", href: "https://fpwwjbevjhxbggtkaabc.supabase.co" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { children: GA_LOADER },
      { type: "application/ld+json", children: ORG_SCHEMA },
      { type: "application/ld+json", children: WEBSITE_SCHEMA },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const locale = getPathLocale(pathname);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function InnerApp() {
  useCartSync();
  return (
    <ChunkErrorBoundary>
      <LegacyQueryRedirect />
      <Outlet />
<CookieConsent />
      <AiAssistant />
    </ChunkErrorBoundary>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  console.error(error);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">
          This page didn't load
        </h1>
        <p className="text-muted-foreground">
          Something went wrong while loading this page. You can try again or go back
          to the start page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
