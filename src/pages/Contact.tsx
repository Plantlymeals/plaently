import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation, tSv } from "@/lib/i18n";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { t, lang } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t("contact.fillAll"));
      return;
    }

    if (form.message.trim().length < 5) {
      toast.error(t("contact.messageTooShort"));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      if (error) {
        console.error("Contact form error:", error);
        setStatus("error");
        toast.error(t("contact.error"));
        return;
      }

      setStatus("success");
      toast.success(t("contact.success"));
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form exception:", err);
      setStatus("error");
      toast.error(t("contact.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEOHead title={t("seo.contact.title")} description={t("seo.contact.description")} ogTitle={tSv("seo.contact.title")} ogDescription={tSv("seo.contact.description")} path="/contact" locale={lang} />
      <section className="py-12 md:py-20">
        <div className="container max-w-2xl space-y-12">
          <Breadcrumbs items={[{ label: lang === "sv" ? "Kontakt" : "Contact", path: "/contact" }]} lang={lang} className="mb-0" />
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("contact.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("contact.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-sm font-medium">{t("contact.name")}</label>
              <Input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("contact.namePlaceholder")} required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium">{t("contact.email")}</label>
              <Input id="contact-email" name="email" autoComplete="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("contact.emailPlaceholder")} required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-sm font-medium">{t("contact.message")}</label>
              <Textarea id="contact-message" name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("contact.messagePlaceholder")} rows={5} required className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full rounded-full font-semibold" size="lg" disabled={loading}>
              {loading ? t("contact.submitting") : t("contact.submit")}
            </Button>

            {status === "success" && (
              <p className="text-sm text-primary text-center">{t("contact.success")}</p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive text-center">{t("contact.error")}</p>
            )}
          </form>
          <div className="text-center space-y-3 animate-fade-up">
            <p className="text-sm text-muted-foreground">{t("contact.orEmail")}</p>
            <a href="mailto:hello@plaently.com" className="text-primary font-medium hover:underline">hello@plaently.com</a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;