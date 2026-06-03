import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Trash2, Star, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";
interface Review {
  id: string;
  product_slug: string;
  author_name: string;
  author_email: string;
  rating: number;
  title: string | null;
  body: string;
  status: Status;
  created_at: string;
  approved_at: string | null;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Status>("pending");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_reviews", { _status: filter });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setReviews((data as Review[]) || []);
  };

  useEffect(() => { fetchReviews(); /* eslint-disable-next-line */ }, [filter]);

  const setStatus = async (id: string, status: Status) => {
    const payload: any = { status };
    if (status === "approved") payload.approved_at = new Date().toISOString();
    const { error } = await supabase.from("product_reviews").update(payload).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Review ${status}`);
    fetchReviews();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold">Reviews</h1>
          <p className="text-sm text-muted-foreground">Moderate customer reviews before they go live.</p>
        </div>
        <Button variant="outline" onClick={fetchReviews} className="rounded-full gap-2" disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <div className="flex gap-2">
        {(["pending", "approved", "rejected"] as Status[]).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
            className="rounded-full capitalize"
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {!loading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No {filter} reviews.</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="bg-card rounded-2xl border border-border/50 p-5 shadow-card space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-semibold">{r.author_name}</span>
                  <span className="text-xs text-muted-foreground">{r.author_email}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground font-mono">{r.product_slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={cn("h-4 w-4", s <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/30")} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {r.status !== "approved" && (
                  <Button size="sm" onClick={() => setStatus(r.id, "approved")} className="rounded-full gap-1">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                )}
                {r.status !== "rejected" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")} className="rounded-full gap-1">
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)} className="rounded-full gap-1 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {r.title && <p className="font-semibold text-sm">{r.title}</p>}
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;