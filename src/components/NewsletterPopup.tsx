import { useState, useEffect } from "react";
import { motion, AnimatePresence, type MotionProps } from "framer-motion";

const MotionDiv = motion.div as React.FC<
  MotionProps & React.HTMLAttributes<HTMLDivElement>
>;
import { X, Gift, Truck, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { useStarterOfferClaim, useStarterOfferCount } from "@/hooks/useStarterOffer";
import { useMarketStore } from "@/stores/marketStore";
const logo = "/images/logo.png";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const market = useMarketStore((s) => s.market);
  const { remaining, soldOut } = useStarterOfferCount();
  const { state, submit } = useStarterOfferClaim();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("newsletter-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setIsOpen(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("newsletter-dismissed", "true");
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value || state.status === "loading") return;

    const result = await submit(value);

    if (result.status === "invalid_email") {
      toast.error(t("newsletter.error"), { description: t("quiz.emailError") });
      return;
    }
    if (result.status === "rate_limited") {
      toast.error(t("offer.rateLimited"), { description: t("offer.rateLimitedDesc") });
      return;
    }
    if (result.status === "error") {
      toast.error(t("offer.error"), { description: t("offer.errorDesc") });
      return;
    }

    if (result.status === "issued") {
      sessionStorage.setItem("newsletter-dismissed", "true");
      // Keep the newsletter list in sync (ignore duplicates).
      await supabase.from("newsletter_subscribers").insert({ email: value });
      // Fire-and-forget: send the real code by email.
      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "starter-offer-code",
            recipientEmail: value,
            data: { code: result.code },
            idempotencyKey: `starter-offer-${value}`,
          },
        })
        .catch((err) => console.error("offer email failed", err));
    }
  };

  const priceLabel = market === "SE" ? t("offer.priceSE") : t("offer.priceEU");

  const benefits = [
    { icon: Gift, title: t("newsletter.benefit1Title"), desc: t("newsletter.benefit1Desc") },
    { icon: Truck, title: t("newsletter.benefit2Title"), desc: t("newsletter.benefit2Desc") },
    { icon: Mail, title: t("newsletter.benefit3Title"), desc: t("newsletter.benefit3Desc") },
  ];

  const issuedCode = state.status === "issued" ? state.code : null;
  const claimedCode = state.status === "already_claimed" ? state.code : null;
  const offerSoldOut = soldOut || state.status === "sold_out";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/50 z-[100]" onClick={handleClose} />
          <MotionDiv initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
              <button onClick={handleClose} className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-muted transition-colors" aria-label={t("newsletter.close")}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="bg-primary pt-8 pb-6 px-6 text-center">
                <img src={logo} alt="PLÄNTLY" className="h-8 mx-auto mb-3 brightness-0 invert" width={160} height={32} />
                <h2 className="text-xl font-heading font-bold text-primary-foreground">{t("offer.title")}</h2>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  {priceLabel} · {t("offer.subtitle")}
                </p>
                {remaining !== null && !offerSoldOut && (
                  <p className="text-primary-foreground/90 text-xs mt-2 font-semibold">
                    {t("offer.remaining").replace("{n}", String(remaining))}
                  </p>
                )}
              </div>
              <div className="p-6">
                {issuedCode || claimedCode ? (
                  <div className="text-center py-2">
                    {issuedCode ? (
                      <>
                        <p className="text-sm text-muted-foreground">{t("offer.yourCode")}</p>
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <span className="font-mono text-lg font-bold tracking-wider border-2 border-dashed border-primary rounded-xl px-4 py-2">
                            {issuedCode}
                          </span>
                          <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => handleCopy(issuedCode)}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? t("offer.copied") : t("offer.copy")}</span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">{t("offer.codeHint")}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-heading font-semibold text-foreground">{t("offer.alreadyClaimed")}</p>
                        <p className="text-muted-foreground text-sm mt-1">{t("offer.alreadyClaimedDesc")}</p>
                        {claimedCode && (
                          <p className="font-mono text-base font-bold tracking-wider mt-3">{claimedCode}</p>
                        )}
                      </>
                    )}
                  </div>
                ) : offerSoldOut ? (
                  <div className="text-center py-4">
                    <p className="text-lg font-heading font-semibold text-foreground">{t("offer.soldOut")}</p>
                    <p className="text-muted-foreground text-sm mt-1">{t("offer.soldOutDesc")}</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {benefits.map((b) => (
                        <div key={b.title} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <b.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{b.title}</p>
                            <p className="text-xs text-muted-foreground">{b.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <Input type="email" placeholder={t("newsletter.placeholder")} value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-full" />
                      <Button type="submit" className="w-full rounded-full font-semibold" disabled={state.status === "loading"}>
                        {state.status === "loading" ? t("newsletter.submitting") : t("newsletter.submit")}
                      </Button>
                    </form>
                    <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
                      {t("newsletter.disclaimer").split("\n").map((line, i) => (
                        <span key={i}>{line}{i === 0 && <br />}</span>
                      ))}
                    </p>
                  </>
                )}
              </div>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
