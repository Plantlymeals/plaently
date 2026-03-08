import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Truck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast.info("Redan prenumerant!", { description: "Denna e-post är redan registrerad." });
      } else {
        toast.error("Något gick fel", { description: "Försök igen senare." });
      }
      return;
    }

    setSubmitted(true);
    sessionStorage.setItem("newsletter-dismissed", "true");
    setTimeout(() => setIsOpen(false), 2000);
  };

  const benefits = [
    { icon: Gift, title: "10% rabatt på din första beställning", desc: "Exklusiv rabatt för nya prenumeranter." },
    { icon: Truck, title: "Gratis fraktuppdateringar", desc: "Bli först med att veta om leveranserbjudanden." },
    { icon: Mail, title: "Recept & tips", desc: "Veckovis växtbaserad näringsinspiration." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-[100]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Stäng"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="bg-primary pt-8 pb-6 px-6 text-center">
                <img src={logo} alt="PLÄNTLY" className="h-7 mx-auto mb-3 brightness-0 invert" />
                <h2 className="text-xl font-heading font-bold text-primary-foreground">
                  Gå med i PLÄNTLY-familjen
                </h2>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  Få exklusiva erbjudanden &amp; växtbaserad inspiration.
                </p>
              </div>

              <div className="p-6">
                {submitted ? (
                  <div className="text-center py-4">
                    <p className="text-lg font-heading font-semibold text-foreground">Välkommen ombord! 🌱</p>
                    <p className="text-muted-foreground text-sm mt-1">Kolla din inkorg för en bekräftelse.</p>
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
                      <Input
                        type="email"
                        placeholder="din@epost.se"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-full"
                      />
                      <Button type="submit" className="w-full rounded-full font-semibold" disabled={loading}>
                        {loading ? "Prenumererar…" : "Prenumerera & spara 10%"}
                      </Button>
                    </form>

                    <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
                      Genom att prenumerera godkänner du att ta emot marknadsföringsmail.
                      <br />
                      Avprenumerera när som helst. Inget spam, aldrig.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
