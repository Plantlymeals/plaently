import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Vänligen fyll i alla fält");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Något gick fel. Försök igen.");
      return;
    }
    toast.success("Tack för ditt meddelande! Vi återkommer snart.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-2xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Kontakta oss</h1>
            <p className="text-muted-foreground text-lg">Frågor, samarbeten eller bara vill säga hej? Vi hör gärna från dig.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <label className="text-sm font-medium">Namn</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ditt namn" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-post</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="din@epost.se" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meddelande</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Ditt meddelande..." rows={5} required className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full rounded-full font-semibold" size="lg" disabled={loading}>
              {loading ? "Skickar…" : "Skicka meddelande"}
            </Button>
          </form>

          <div className="text-center space-y-3 animate-fade-up">
            <p className="text-sm text-muted-foreground">Eller maila oss direkt på</p>
            <a href="mailto:hello@plantly.com" className="text-primary font-medium hover:underline">hello@plantly.com</a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
