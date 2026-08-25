import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, Power, CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DiscountCode { id: number; code: string; usage_count: number; }
interface PriceRule {
  id: number;
  title: string;
  value_type: "percentage" | "fixed_amount";
  value: string;
  customer_selection: string;
  target_type: string;
  target_selection: string;
  allocation_method: string;
  once_per_customer: boolean;
  usage_limit: number | null;
  starts_at: string | null;
  ends_at: string | null;
  prerequisite_subtotal_range?: { greater_than_or_equal_to: string } | null;
  discount_codes?: DiscountCode[];
}

const blankForm = () => ({
  title: "",
  code: "",
  value_type: "percentage" as "percentage" | "fixed_amount",
  value: "10",
  once_per_customer: false,
  usage_limit: "" as string,
  prerequisite_subtotal: "" as string,
  starts_at: undefined as Date | undefined,
  ends_at: undefined as Date | undefined,
});

type FormState = ReturnType<typeof blankForm>;

const invoke = async (action: string, payload: Record<string, unknown> = {}) => {
  const { data, error } = await supabase.functions.invoke("shopify-discounts", {
    body: { action, ...payload },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
};

const AdminDiscounts = () => {
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await invoke("list");
      setRules(data.rules || []);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const startNew = () => { setEditing("new"); setForm(blankForm()); };
  const startEdit = (r: PriceRule) => {
    setEditing(r.id);
    setForm({
      title: r.title,
      code: r.discount_codes?.[0]?.code ?? "",
      value_type: r.value_type,
      value: String(Math.abs(parseFloat(r.value))),
      once_per_customer: r.once_per_customer,
      usage_limit: r.usage_limit ? String(r.usage_limit) : "",
      prerequisite_subtotal: r.prerequisite_subtotal_range?.greater_than_or_equal_to ?? "",
      starts_at: r.starts_at ? new Date(r.starts_at) : undefined,
      ends_at: r.ends_at ? new Date(r.ends_at) : undefined,
    });
  };
  const cancel = () => { setEditing(null); setForm(blankForm()); };

  const buildRulePayload = () => {
    if (!form.title.trim()) throw new Error("Title is required");
    const numericValue = parseFloat(form.value);
    if (Number.isNaN(numericValue) || numericValue <= 0) throw new Error("Value must be a positive number");
    return {
      title: form.title,
      value_type: form.value_type,
      value: `-${numericValue}`,
      customer_selection: "all",
      target_type: "line_item",
      target_selection: "all",
      allocation_method: form.value_type === "percentage" ? "across" : "across",
      once_per_customer: form.once_per_customer,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      starts_at: form.starts_at ? form.starts_at.toISOString() : new Date().toISOString(),
      ends_at: form.ends_at ? form.ends_at.toISOString() : null,
      ...(form.prerequisite_subtotal
        ? { prerequisite_subtotal_range: { greater_than_or_equal_to: form.prerequisite_subtotal } }
        : {}),
    };
  };

  const save = async () => {
    try {
      const rule = buildRulePayload();
      if (editing === "new") {
        if (!form.code.trim()) throw new Error("Discount code is required");
        await invoke("create", { rule, code: form.code.trim() });
        toast.success("Discount created");
      } else if (typeof editing === "number") {
        await invoke("update", { price_rule_id: editing, rule });
        toast.success("Discount updated");
      }
      cancel();
      fetchRules();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const disableRule = async (id: number) => {
    if (!confirm("Disable this discount? It will stop working immediately.")) return;
    try {
      await invoke("disable", { price_rule_id: id });
      toast.success("Discount disabled");
      fetchRules();
    } catch (e) { toast.error((e as Error).message); }
  };

  const removeRule = async (id: number) => {
    if (!confirm("Delete this discount permanently?")) return;
    try {
      await invoke("delete", { price_rule_id: id });
      toast.success("Discount deleted");
      fetchRules();
    } catch (e) { toast.error((e as Error).message); }
  };

  const isActive = (r: PriceRule) => {
    const now = Date.now();
    if (r.ends_at && new Date(r.ends_at).getTime() < now) return false;
    if (r.starts_at && new Date(r.starts_at).getTime() > now) return false;
    return true;
  };

  const DateField = ({ label, value, onChange }: { label: string; value?: Date | undefined; onChange: (d?: Date | undefined) => void }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal rounded-xl", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
          {value && (
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => onChange(undefined)}>Clear</Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold">Discount Codes</h1>
          <p className="text-sm text-muted-foreground">Manage Shopify discount codes, dates and conditions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRules} className="rounded-full gap-2" disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={startNew} className="rounded-full gap-2"><Plus className="h-4 w-4" /> New Discount</Button>
        </div>
      </div>

      {editing !== null && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
          <h2 className="font-heading font-semibold">{editing === "new" ? "New Discount" : "Edit Discount"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Title *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" placeholder="Summer Sale" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Code {editing === "new" && "*"}</label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="rounded-xl uppercase"
                placeholder="SUMMER10"
                disabled={editing !== "new"}
              />
              {editing !== "new" && <p className="text-[10px] text-muted-foreground">Code cannot be changed after creation.</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Type</label>
              <select
                value={form.value_type}
                onChange={(e) => setForm({ ...form, value_type: e.target.value as "percentage" | "fixed_amount" })}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed amount (SEK)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Value *</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="rounded-xl"
                placeholder={form.value_type === "percentage" ? "10" : "50"}
              />
            </div>
            <DateField label="Starts at" value={form.starts_at} onChange={(d) => setForm({ ...form, starts_at: d })} />
            <DateField label="Ends at" value={form.ends_at} onChange={(d) => setForm({ ...form, ends_at: d })} />
            <div className="space-y-1">
              <label className="text-xs font-medium">Usage limit</label>
              <Input
                type="number"
                min="0"
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                className="rounded-xl"
                placeholder="Unlimited"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Minimum subtotal (SEK)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.prerequisite_subtotal}
                onChange={(e) => setForm({ ...form, prerequisite_subtotal: e.target.value })}
                className="rounded-xl"
                placeholder="No minimum"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="once_per_customer"
              type="checkbox"
              checked={form.once_per_customer}
              onChange={(e) => setForm({ ...form, once_per_customer: e.target.checked })}
            />
            <label htmlFor="once_per_customer" className="text-sm">Limit to one use per customer</label>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="rounded-full gap-2"><Check className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={cancel} className="rounded-full gap-2"><X className="h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading && rules.length === 0 && (
          <p className="text-sm text-muted-foreground">Loading discounts…</p>
        )}
        {!loading && rules.length === 0 && (
          <p className="text-sm text-muted-foreground">No discounts yet. Create your first one above.</p>
        )}
        {rules.map((r) => {
          const active = isActive(r);
          const code = r.discount_codes?.[0]?.code;
          const usage = r.discount_codes?.[0]?.usage_count ?? 0;
          return (
            <div key={r.id} className="bg-card rounded-2xl border border-border/50 p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-semibold truncate">{r.title}</h3>
                  <span className={cn(
                    "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full",
                    active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>{active ? "Active" : "Inactive"}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {code && <span className="font-mono font-semibold text-foreground">{code}</span>}
                  {code && " · "}
                  {r.value_type === "percentage" ? `${Math.abs(parseFloat(r.value))}% off` : `${Math.abs(parseFloat(r.value))} SEK off`}
                  {r.usage_limit ? ` · Limit ${r.usage_limit}` : ""}
                  {` · Used ${usage}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.starts_at ? `From ${format(new Date(r.starts_at), "PP")}` : "No start"}
                  {" → "}
                  {r.ends_at ? `to ${format(new Date(r.ends_at), "PP")}` : "no end"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => startEdit(r)} className="rounded-full gap-2"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                {active && (
                  <Button variant="outline" size="sm" onClick={() => disableRule(r.id)} className="rounded-full gap-2"><Power className="h-3.5 w-3.5" /> Disable</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => removeRule(r.id)} className="rounded-full gap-2 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDiscounts;