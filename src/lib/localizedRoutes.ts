// Language-paired URLs. The page content on these routes is driven by the URL,
// so the header language switcher must navigate to the sister page.
export const LOCALIZED_ROUTE_PAIRS: Array<{ sv: string; en: string }> = [
  { sv: "/proteinrika-maltider", en: "/high-protein-meals" },
  { sv: "/nyttig-snabbmat", en: "/healthy-fast-food" },
  { sv: "/halsosamma-snabbmaltider", en: "/healthy-instant-meals" },
  { sv: "/plantbaserade-maltider", en: "/plant-based-meals" },
  { sv: "/proteinkoppar", en: "/protein-cups" },
  { sv: "/frakt", en: "/shipping" },
  { sv: "/kopsvillkor", en: "/terms-of-service" },
  { sv: "/integritetspolicy", en: "/privacy-policy" },
];

/** Returns the sister URL for `pathname` in `targetLang`, or null when the route isn't language-paired. */
export const getLocalizedSisterPath = (
  pathname: string,
  targetLang: "sv" | "en"
): string | null => {
  const path = pathname.replace(/\/+$/, "") || "/";
  const pair = LOCALIZED_ROUTE_PAIRS.find((p) => p.sv === path || p.en === path);
  if (!pair) return null;
  const target = pair[targetLang];
  return target === path ? null : target;
};
