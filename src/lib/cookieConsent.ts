import { useEffect, useState } from "react";

export const CONSENT_STORAGE_KEY = "plaently_cookie_consent_v1";
export const CONSENT_EVENT = "plaently-consent-change";
export const CONSENT_OPEN_EVENT = "plaently-consent-open";
export const CONSENT_VERSION = 1;

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = ConsentCategories & {
  version: number;
  updatedAt: string;
};

export const readConsent = (): ConsentRecord | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return { ...parsed, necessary: true };
  } catch {
    return null;
  }
};

export const saveConsent = (choice: { analytics: boolean; marketing: boolean }) => {
  const record: ConsentRecord = {
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* storage blocked — consent stays session-only */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  return record;
};

/** Withdrawing consent must also clear cookies already set by those services. */
export const clearNonEssentialCookies = () => {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name) return;
    if (!/^(_ga|_gid|_gat|_gcl|_fbp|_fbc|__utm)/.test(name)) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
    });
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
};

export const useConsent = () => {
  const [consent, setConsent] = useState<ConsentRecord | null>(() => readConsent());
  useEffect(() => {
    const sync = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return consent;
};
