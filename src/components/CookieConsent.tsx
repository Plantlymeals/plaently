import { useCallback, useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/lib/i18n";
import {
  CONSENT_OPEN_EVENT,
  clearNonEssentialCookies,
  readConsent,
  saveConsent,
} from "@/lib/cookieConsent";

const copy = {
  sv: {
    title: "Vi använder cookies",
    body: "Vi använder nödvändiga cookies för att sajten ska fungera. Med ditt samtycke använder vi även cookies för statistik och marknadsföring. Du kan ändra ditt val när som helst.",
    accept: "Acceptera alla",
    reject: "Endast nödvändiga",
    customize: "Anpassa",
    save: "Spara val",
    policy: "Integritetspolicy",
    settingsTitle: "Cookie-inställningar",
    necessary: "Nödvändiga",
    necessaryDesc: "Krävs för kundvagn, språkval och säkerhet. Kan inte stängas av.",
    analytics: "Statistik",
    analyticsDesc: "Google Analytics hjälper oss förstå hur sajten används.",
    marketing: "Marknadsföring",
    marketingDesc: "Används för relevanta annonser och mätning av kampanjer.",
    always: "Alltid på",
    manage: "Cookie-inställningar",
  },
  en: {
    title: "We use cookies",
    body: "We use necessary cookies to make the site work. With your consent we also use cookies for analytics and marketing. You can change your choice at any time.",
    accept: "Accept all",
    reject: "Necessary only",
    customize: "Customize",
    save: "Save choices",
    policy: "Privacy policy",
    settingsTitle: "Cookie settings",
    necessary: "Necessary",
    necessaryDesc: "Required for cart, language and security. Cannot be disabled.",
    analytics: "Analytics",
    analyticsDesc: "Google Analytics helps us understand how the site is used.",
    marketing: "Marketing",
    marketingDesc: "Used for relevant ads and campaign measurement.",
    always: "Always on",
    manage: "Cookie settings",
  },
} as const;

const CookieConsent = () => {
  const { lang } = useTranslation();
  const c = copy[lang === "en" ? "en" : "sv"];
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const onOpen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  const commit = useCallback((choice: { analytics: boolean; marketing: boolean }) => {
    if (!choice.analytics || !choice.marketing) clearNonEssentialCookies();
    saveConsent(choice);
    setOpen(false);
    setDetails(false);
  }, []);

  if (!open) return null;

  const policyHref = "/integritetspolicy";

  return (
<div
      role="dialog"
      aria-modal="false"
      aria-label={c.settingsTitle}
      data-consent-banner="true"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{details ? c.settingsTitle : c.title}</h2>
            <p className="text-sm text-muted-foreground">
              {c.body}{" "}
              <Link to={policyHref} className="underline underline-offset-2 hover:text-foreground">
                {c.policy}
              </Link>
            </p>
          </div>

          {details && (
            <div className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{c.necessary}</p>
                  <p className="text-xs text-muted-foreground">{c.necessaryDesc}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">{c.always}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{c.analytics}</p>
                  <p className="text-xs text-muted-foreground">{c.analyticsDesc}</p>
                </div>
                <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label={c.analytics} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{c.marketing}</p>
                  <p className="text-xs text-muted-foreground">{c.marketingDesc}</p>
                </div>
                <Switch checked={marketing} onCheckedChange={setMarketing} aria-label={c.marketing} />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            {details ? (
              <Button variant="outline" onClick={() => commit({ analytics, marketing })}>
                {c.save}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setDetails(true)}>
                {c.customize}
              </Button>
            )}
            <Button variant="outline" onClick={() => commit({ analytics: false, marketing: false })}>
              {c.reject}
            </Button>
            <Button onClick={() => commit({ analytics: true, marketing: true })}>{c.accept}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
