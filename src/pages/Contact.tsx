import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for reaching out! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-2xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-muted-foreground text-lg">Questions, partnerships, or just want to say hi? We'd love to hear from you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} required className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full rounded-full font-semibold" size="lg">Send Message</Button>
          </form>

          <div className="text-center space-y-3 animate-fade-up">
            <p className="text-sm text-muted-foreground">Or email us directly at</p>
            <a href="mailto:hello@plantly.com" className="text-primary font-medium hover:underline">hello@plantly.com</a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
