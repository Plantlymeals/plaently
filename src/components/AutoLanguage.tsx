import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getVisitorCountry } from "@/lib/geo.functions";
import { useLangStore } from "@/lib/i18n";

const STORAGE_KEY = "plantely-lang";

/**
 * First-time visitors get their UI language from their country:
 * Sweden -> Swedish, everywhere else -> English.
 * A stored preference (the header toggle) always wins and is never overwritten.
 * Only affects interface strings via i18n — page content is untouched.
 */
const AutoLanguage = () => {
  const fetchCountry = useServerFn(getVisitorCountry);
  const setLang = useLangStore((s) => s.setLang);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (stored) return; // user preference wins

    let cancelled = false;
    fetchCountry()
      .then(({ country }) => {
        if (cancelled || !country) return; // no geo info -> keep Swedish default
        setLang(country === "SE" ? "sv" : "en");
      })
      .catch(() => {
        /* keep default */
      });
    return () => {
      cancelled = true;
    };
  }, [fetchCountry, setLang]);

  return null;
};

export default AutoLanguage;
