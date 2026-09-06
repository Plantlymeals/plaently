import { resolveProductImageUrl } from "@/lib/productImages";

export type ProductSeoEntry = {
  sv: { title: string; description: string };
  en: { title: string; description: string };
  schema: {
    name: string;
    sku: string;
    calories: string;
    protein: string;
    servingSize: string;
    description: string;
  };
};

const PRODUCT_SEO: Record<string, ProductSeoEntry> = {
  "fusilli-bolognese": {
    sv: { title: "Vegan Fusilli Bolognese | 20g Protein, 263 kcal — PLÄNTLY", description: "Vegansk Fusilli Bolognese med 20g växtprotein och 263 kcal. Klar på 5 minuter — tillsätt kokande vatten upp till det svarta strecket. 75g per portion." },
    en: { title: "Vegan Fusilli Bolognese | 20g Protein, 263 kcal — PLÄNTLY", description: "Vegan Fusilli Bolognese with 20g plant protein, 263 kcal. Ready in 5 minutes — add boiling water to the black line. 75g per serving." },
    schema: { name: "Vegan Fusilli Bolognese", sku: "PLNT-FUS-001", calories: "263 calories", protein: "20.3g", servingSize: "75g", description: "Vegansk Fusilli Bolognese med 20g växtprotein. Klar på 5 minuter." },
  },
  "pasta-carbonara": {
    sv: { title: "Vegetarisk Pasta Carbonara | 20g Protein, 285 kcal — PLÄNTLY", description: "Vegetarisk Pasta Carbonara med 20g växtprotein och 285 kcal. Klar på 5 minuter — tillsätt kokande vatten upp till det svarta strecket. Innehåller mjölk." },
    en: { title: "Veggie Pasta Carbonara | 20g Protein, 285 kcal — PLÄNTLY", description: "Veggie Pasta Carbonara with 20g plant protein, 285 kcal. Ready in 5 minutes. Contains milk." },
    schema: { name: "Veggie Pasta Carbonara", sku: "PLNT-CAR-001", calories: "285 calories", protein: "20.2g", servingSize: "75g", description: "Vegetarisk Pasta Carbonara med 20g växtprotein. Klar på 5 minuter. Innehåller mjölk." },
  },
  "yellow-curry-rice": {
    sv: { title: "Vegetarisk Yellow Curry & Rice | 20g Protein, 285 kcal — PLÄNTLY", description: "Vegetarisk Yellow Curry & Rice med 20g växtprotein och 285 kcal. Klar på 5 minuter — tillsätt kokande vatten upp till det svarta strecket. Innehåller mjölk." },
    en: { title: "Veggie Yellow Curry & Rice | 20g Protein, 285 kcal — PLÄNTLY", description: "Veggie Yellow Curry & Rice with 20g plant protein, 285 kcal. Ready in 5 minutes. Contains milk." },
    schema: { name: "Veggie Yellow Curry & Rice", sku: "PLNT-CUR-001", calories: "285 calories", protein: "20.4g", servingSize: "73g", description: "Vegetarisk Yellow Curry & Rice med 20g växtprotein. Klar på 5 minuter. Innehåller mjölk." },
  },
  "smoky-bbq-lentils": {
    sv: { title: "Vegan Smoky BBQ Lentils | 21g Protein, 228 kcal — PLÄNTLY", description: "Vegansk Smoky BBQ Lentils med 21g växtprotein och 228 kcal. Klar på 5 minuter — tillsätt kokande vatten upp till det svarta strecket. 65g per portion." },
    en: { title: "Vegan Smoky BBQ Lentils | 21g Protein, 228 kcal — PLÄNTLY", description: "Vegan Smoky BBQ Lentils with 21g plant protein, 228 kcal. Ready in 5 minutes. 65g per serving." },
    schema: { name: "Vegan Smoky BBQ Lentils", sku: "PLNT-LEN-001", calories: "228 calories", protein: "20.8g", servingSize: "65g", description: "Vegansk Smoky BBQ Lentils med 21g växtprotein. Klar på 5 minuter." },
  },
  "starter-pack-12-cups-1": {
    sv: { title: "Starter Pack – 20g protein på 5 min | PLÄNTLY", description: "Mix av alla 4 smaker. 12 proteinmåltider — levereras inom 1-2 vardagar." },
    en: { title: "Starter Pack – 20g protein in 5 min | PLÄNTLY", description: "A mix of all 4 flavours. 12 protein meals — delivered in 1-2 business days." },
    schema: { name: "Starter Pack", sku: "PLNT-STARTER-12", calories: "", protein: "20g", servingSize: "1 cup", description: "12 proteinmåltider i fyra smaker." },
  },
  "monthly-box-24-cups": {
    sv: { title: "Monthly Box 24 koppar – Proteinmåltider | PLÄNTLY", description: "24 proteinmåltider med 20g protein per portion. Välj din mix och få riktiga måltider klara på 5 minuter." },
    en: { title: "Monthly Box 24 Cups – Protein Meals | PLÄNTLY", description: "24 protein meals with 20g protein per serving. Choose your mix and enjoy real meals ready in 5 minutes." },
    schema: { name: "Monthly Box – 24 Cups", sku: "PLNT-MONTHLY-24", calories: "", protein: "20g", servingSize: "1 cup", description: "24 proteinmåltider med valfri smakmix." },
  },
  "office-pack-48-cups": {
    sv: { title: "Office Pack 48 koppar – Kontorslunch | PLÄNTLY", description: "48 proteinmåltider för kontoret. Riktiga, mättande måltider med 20g protein — klara på 5 minuter." },
    en: { title: "Office Pack 48 Cups – Office Lunches | PLÄNTLY", description: "48 protein meals for the office. Real, filling meals with 20g protein — ready in 5 minutes." },
    schema: { name: "Office Pack – 48 Cups", sku: "PLNT-OFFICE-48", calories: "", protein: "20g", servingSize: "1 cup", description: "48 proteinmåltider för kontor och team." },
  },
  "big-office-pack-96-cups": {
    sv: { title: "Big Office Pack 96 koppar – Kontorsmat | PLÄNTLY", description: "96 proteinmåltider för större team. Smidiga kontorsluncher med 20g protein per portion — klara på 5 minuter." },
    en: { title: "Big Office Pack 96 Cups – Office Meals | PLÄNTLY", description: "96 protein meals for larger teams. Easy office lunches with 20g protein per serving — ready in 5 minutes." },
    schema: { name: "Big Office Pack – 96 Cups", sku: "PLNT-BIG-OFFICE-96", calories: "", protein: "20g", servingSize: "1 cup", description: "96 proteinmåltider för större kontor och team." },
  },
  "bolognese-box-12-cups": {
    sv: { title: "Bolognese Box 12 koppar – 20g protein | PLÄNTLY", description: "För dig som älskar italiensk comfort food. 12 portioner fyllda med fyllig smak och 20 g protein per måltid." },
    en: { title: "Bolognese Box 12 Cups – 20g Protein | PLÄNTLY", description: "For anyone who loves Italian comfort food. 12 servings packed with rich flavour and 20 g protein per meal." },
    schema: { name: "Bolognese Box – 12 Cups", sku: "PLNT-BOLOGNESE-12", calories: "263 calories", protein: "20g", servingSize: "1 cup", description: "12 portioner fyllda med fyllig smak och 20 g protein per måltid." },
  },
  "carbonara-box-12-cups": {
    sv: { title: "Carbonara Box 12 koppar – 20g protein | PLÄNTLY", description: "Krämig, proteinrik och alltid redo på 5 minuter." },
    en: { title: "Carbonara Box 12 Cups – 20g Protein | PLÄNTLY", description: "Creamy, protein-rich and always ready in 5 minutes." },
    schema: { name: "Carbonara Box – 12 Cups", sku: "PLNT-CARBONARA-12", calories: "285 calories", protein: "20g", servingSize: "1 cup", description: "Krämig, proteinrik och alltid redo på 5 minuter." },
  },
  "smoky-lentils-box-12-cups": {
    sv: { title: "Smoky Lentils Box 12 koppar – 21g protein | PLÄNTLY", description: "Rökig, mättande och full av växtbaserad kraft med 21 g protein." },
    en: { title: "Smoky Lentils Box 12 Cups – 21g Protein | PLÄNTLY", description: "Smoky, filling and packed with plant-based power with 21 g protein." },
    schema: { name: "Smoky Lentils Box – 12 Cups", sku: "PLNT-SMOKY-12", calories: "228 calories", protein: "21g", servingSize: "1 cup", description: "Rökig, mättande och full av växtbaserad kraft med 21 g protein." },
  },
  "yellow-curry-box-12-cups": {
    sv: { title: "Yellow Curry Box 12 koppar – 20g protein | PLÄNTLY", description: "Värmande kryddor och balanserad energi i varje portion med 20 g protein." },
    en: { title: "Yellow Curry Box 12 Cups – 20g Protein | PLÄNTLY", description: "Warming spices and balanced energy in every serving with 20 g protein." },
    schema: { name: "Yellow Curry Box – 12 Cups", sku: "PLNT-CURRY-12", calories: "285 calories", protein: "20g", servingSize: "1 cup", description: "Värmande kryddor och balanserad energi i varje portion med 20 g protein." },
  },
};

export const HANDLE_ALIASES: Record<string, string> = {
  "monthly-box-30-cups": "monthly-box-24-cups",
  "office-pack-60-cups": "office-pack-48-cups",
  "big-office-pack-120-cups": "big-office-pack-96-cups",
};

/**
 * Normalizes any incoming/legacy handle to the single canonical handle used in
 * URLs and Shopify lookups. The `plant-based-` prefix is part of the real
 * Shopify handles, so it must NOT be stripped here.
 */
/**
 * Short meal slugs that were published without the `plant-based-` prefix.
 * Kept separate from HANDLE_ALIASES because seoKey() strips the prefix before
 * looking up copy — merging them there would create a lookup cycle.
 */
const PREFIX_ALIASES: Record<string, string> = {
  "fusilli-bolognese": "plant-based-fusilli-bolognese",
  "pasta-carbonara": "plant-based-pasta-carbonara",
  "smoky-bbq-lentils": "plant-based-smoky-bbq-lentils",
  "yellow-curry-rice": "plant-based-yellow-curry-rice",
};

export function canonicalizeHandle(handle: string): string {
  return PREFIX_ALIASES[handle] ?? HANDLE_ALIASES[handle] ?? handle;
}

/** SEO copy is keyed without the `plant-based-` prefix. */
function seoKey(handle: string): string {
  const withoutPrefix = handle.replace(/^plant-based-/, "");
  return HANDLE_ALIASES[withoutPrefix] ?? withoutPrefix;
}

export function getProductSeo(handle: string | undefined): ProductSeoEntry | undefined {
  if (!handle) return undefined;
  return PRODUCT_SEO[seoKey(handle)];
}

export function productUrl(handle: string, locale: "sv" | "en" = "sv"): string {
  const canonicalHandle = canonicalizeHandle(handle);
  return locale === "en"
    ? `https://plaently.com/en/product/${canonicalHandle}`
    : `https://plaently.com/product/${canonicalHandle}`;
}

export function getProductRouteHead(
  handle: string,
  locale: "sv" | "en" = "sv",
  options: { noindex?: boolean; hasEnglishAlternate?: boolean } = {}
) {
  const canonicalHandle = canonicalizeHandle(handle);
  const seo = getProductSeo(canonicalHandle);
  const image = resolveProductImageUrl({ handle: canonicalHandle, title: seo?.schema.name ?? canonicalHandle });
  const copy = locale === "en" ? seo?.en : seo?.sv;
  const title =
    copy?.title ??
    (locale === "en" ? "Protein meal – 20g protein | PLÄNTLY" : "Proteinmåltid – 20g protein | PLÄNTLY");
  const description =
    copy?.description ??
    (locale === "en"
      ? "A real protein meal with 20g protein, ready in 5 minutes."
      : "Riktig proteinmåltid med 20g protein, klar på 5 minuter.");
  const svUrl = productUrl(canonicalHandle, "sv");
  const enUrl = productUrl(canonicalHandle, "en");
  const url = locale === "en" ? enUrl : svUrl;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "product" },
      { property: "og:locale", content: locale === "en" ? "en_GB" : "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
      ...(options.noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    ],
    links: [
      { rel: "canonical", href: url },
      ...(options.hasEnglishAlternate
        ? [
            { rel: "alternate", hreflang: "sv", href: svUrl },
            { rel: "alternate", hreflang: "en", href: enUrl },
            { rel: "alternate", hreflang: "x-default", href: svUrl },
          ]
        : []),
    ],
  };
}
/**
 * Product-specific copy that must exist in the *server-rendered* HTML so each
 * /product/:handle page has unique body content on first paint (Google folded
 * pages together as duplicates when only the meta tags differed).
 */
export function getProductSsrCopy(handle: string | undefined, locale: "sv" | "en" = "sv"): { name: string; description: string } {
  const canonical = canonicalizeHandle(handle ?? "");
  const seo = getProductSeo(canonical);
  if (seo) {
    return { name: seo.schema.name, description: seo[locale].description };
  }
  const name = canonical
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    name: name || "PLÄNTLY",
    description: locale === "sv"
      ? `${name} från PLÄNTLY – proteinmåltid med 20g protein, klar på 5 minuter.`
      : `${name} from PLÄNTLY – protein meal with 20g protein, ready in 5 minutes.`,
  };
}
