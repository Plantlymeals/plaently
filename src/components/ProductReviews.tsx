import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useTranslation } from "@/lib/i18n";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
}

const makeReviewSchema = (t: (k: string) => string) => z.object({
  author_name: z.string().trim().min(1, t("reviews.errNameRequired")).max(100),
  author_email: z.string().trim().email(t("reviews.errInvalidEmail")).max(255),
  rating: z.number().int().min(1, t("reviews.errPickRating")).max(5),
  title: z.string().trim().max(150).optional().or(z.literal("")),
  body: z.string().trim().min(5, t("reviews.errBodyMin")).max(2000),
});

const StarRow = ({ value, size = 4 }: { value: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={cn(
          `h-${size} w-${size}`,
          s <= value ? "fill-primary text-primary" : "text-muted-foreground/30"
        )}
      />
    ))}
  </div>
);

const ProductReviews = ({ productSlug, title }: { productSlug: string; title: string }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ author_name: "", author_email: "", rating: 0, title: "", body: "" });

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("public_product_reviews" as any)
      .select("id, author_name, rating, title, body, created_at")
      .eq("product_slug", productSlug)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setReviews(data as unknown as Review[]);
  };

  useEffect(() => { fetchReviews(); }, [productSlug]);

  const submit = async () => {
    const parsed = makeReviewSchema(t).safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_slug: productSlug,
      author_name: parsed.data.author_name,
      author_email: parsed.data.author_email,
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      body: parsed.data.body,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("reviews.submitSuccess"));
    setForm({ author_name: "", author_email: "", rating: 0, title: "", body: "" });
    setShowForm(false);
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-16">
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        {avg ? (
          <>
            <StarRow value={Math.round(parseFloat(avg))} size={5} />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{avg}</span> · {reviews.length} {reviews.length === 1 ? t("reviews.countOne") : t("reviews.countMany")}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t("reviews.noReviews")}</p>
        )}
        <h2 className="font-heading text-2xl md:text-3xl font-bold">{t("reviews.title")}</h2>
        <Button onClick={() => setShowForm((s) => !s)} variant="outline" className="rounded-full mt-2">
          {showForm ? t("reviews.cancel") : t("reviews.write")}
        </Button>
      </div>

      {showForm && (
        <div className="max-w-xl mx-auto bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4 mb-10">
          <h3 className="font-heading font-semibold">{t("reviews.formTitle")} {title}</h3>
          <div className="space-y-1">
            <label className="text-xs font-medium">{t("reviews.labelRating")}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, rating: s })}
                  className="p-1"
                  aria-label={`${s} stars`}
                >
                  <Star className={cn("h-7 w-7 transition-colors", s <= form.rating ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-primary/50")} />
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">{t("reviews.labelName")}</label>
              <Input value={form.author_name} maxLength={100} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">{t("reviews.labelEmail")}</label>
              <Input type="email" value={form.author_email} maxLength={255} onChange={(e) => setForm({ ...form, author_email: e.target.value })} className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">{t("reviews.labelTitle")}</label>
            <Input value={form.title} maxLength={150} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" placeholder={t("reviews.placeholderOptional")} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">{t("reviews.labelBody")}</label>
            <Textarea value={form.body} maxLength={2000} rows={4} onChange={(e) => setForm({ ...form, body: e.target.value })} className="rounded-xl" />
          </div>
          <Button onClick={submit} disabled={submitting} className="rounded-full w-full font-semibold">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("reviews.submit")}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">{t("reviews.approvalNote")}</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-card border border-border/50 p-6 shadow-card">
              <StarRow value={r.rating} />
              {r.title && <p className="font-heading font-semibold text-sm mt-3">{r.title}</p>}
              <p className="text-sm text-foreground leading-relaxed mt-2 mb-4">"{r.body}"</p>
              <p className="font-semibold text-sm text-foreground">{r.author_name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;