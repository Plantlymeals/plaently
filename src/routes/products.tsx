import { createFileRoute } from "@tanstack/react-router";
import { Products } from "@/pages/Products";

const TITLE = "Proteinmåltider | 20g protein på 5 min | PLÄNTLY";
const DESCRIPTION = "Fyra proteinmåltider med 20g protein per portion — Fusilli Bolognese, Pasta Carbonara, Yellow Curry & Rice och Smoky BBQ Lentils. Klara på 5 minuter, bara tillsätt kokande vatten.";
const URL = "https://plaently.com/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "sv", href: URL },
      { rel: "alternate", hrefLang: "en", href: URL },
      { rel: "alternate", hrefLang: "x-default", href: URL },
    ],
  }),
  component: Products,
});
