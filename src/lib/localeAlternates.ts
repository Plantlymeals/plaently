// Central map of SV/EN URL pairs so Google treats them as language alternates,
// not duplicates. Every pair gets self-referencing canonicals + reciprocal hreflang.

export interface Alternate {
  hreflang: string;
  path: string;
}

/** [Swedish path, English path] pairs. */
export const LOCALE_PAIRS: [string, string][] = [
  ["/proteinrika-maltider", "/high-protein-meals"],
  ["/plantbaserade-maltider", "/plant-based-meals"],
  ["/halsosamma-snabbmaltider", "/healthy-instant-meals"],
  ["/nyttig-snabbmat", "/healthy-fast-food"],
  ["/proteinkoppar", "/protein-cups"],
  ["/frakt", "/shipping"],
  ["/integritetspolicy", "/privacy-policy"],
  ["/kopsvillkor", "/terms-of-service"],
];

export const normalizePath = (path: string): string => {
  if (!path) return "/";
  const [clean] = path.split(/[?#]/);
  const trimmed = (clean ?? "").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

/** Returns the SV/EN pair for a path, or null when the URL serves both languages. */
export const getLocalePair = (path: string): { sv: string; en: string } | null => {
  const p = normalizePath(path);
  const hit = LOCALE_PAIRS.find(([sv, en]) => sv === p || en === p);
  return hit ? { sv: hit[0], en: hit[1] } : null;
};

/** Language encoded by a paired route; unpaired URLs use Swedish by default. */
export const getPathLocale = (path: string): "sv" | "en" => {
  const normalized = normalizePath(path);
  const pair = getLocalePair(normalized);
  return pair?.en === normalized ? "en" : "sv";
};

/**
 * hreflang set for a path. Paired URLs point at each other; single URLs
 * declare themselves for both languages (same content, language toggle).
 */
export const getAlternates = (path: string): Alternate[] => {
  const p = normalizePath(path);
  const pair = getLocalePair(p);
  if (pair) {
    return [
      { hreflang: "sv", path: pair.sv },
      { hreflang: "en", path: pair.en },
      { hreflang: "x-default", path: pair.sv },
    ];
  }
  return [
    { hreflang: "sv", path: p },
    { hreflang: "en", path: p },
    { hreflang: "x-default", path: p },
  ];
};
