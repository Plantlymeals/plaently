import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t("contact.fillAll"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim()
    });
    setLoading(false);
    if (error) {
      toast.error(t("contact.error"));
      return;
    }
    toast.success(t("contact.success"));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-2xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("contact.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("contact.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("contact.name")}</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("contact.namePlaceholder")} required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("contact.email")}</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("contact.emailPlaceholder")} required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("contact.message")}</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("contact.messagePlaceholder")} rows={5} required className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full rounded-full font-semibold" size="lg" disabled={loading}>
              {loading ? t("contact.submitting") : t("contact.submit")}
            </Button>
          </form>
          <div className="text-center space-y-3 animate-fade-up">
            <p className="text-sm text-muted-foreground">{t("contact.orEmail")}</p>
            <a href="mailto:hello@plantly.com" className="text-primary font-medium hover:underline">hello@plantly.com</a>
          </div>
        </div>
      </section>
    </Layout>);

};

export default Contact;