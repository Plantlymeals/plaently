import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2 } from "lucide-react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useTranslation } from "@/lib/i18n";
import { getCupImage } from "@/lib/productImages";

interface MixBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundleTitle: string;
  totalCups: number;
  isLoading?: boolean;
  onConfirm: (mix: Array<{ key: string; value: string }>) => void;
}

function evenSplit(flavourCount: number, total: number): number[] {
  if (flavourCount === 0) return [];
  const base = Math.floor(total / flavourCount);
  const remainder = total - base * flavourCount;
  return Array.from({ length: flavourCount }, (_, i) => base + (i < remainder ? 1 : 0));
}

export const MixBuilderDialog = ({
  open,
  onOpenChange,
  bundleTitle,
  totalCups,
  isLoading,
  onConfirm,
}: MixBuilderDialogProps) => {
  const { t } = useTranslation();
  const [flavours, setFlavours] = useState<ShopifyProduct[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    fetchShopifyProducts(20, "product_type:Meal")
      .then((data) => {
        if (cancelled) return;
        const list = data || [];
        setFlavours(list);
        setCounts(evenSplit(list.length, totalCups));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [open, totalCups]);

  const total = useMemo(() => counts.reduce((s, n) => s + n, 0), [counts]);
  const isValid = total === totalCups;

  const adjust = (idx: number, delta: number) => {
    setCounts((prev) => {
      const next = [...prev];
      next[idx] = Math.max(0, next[idx] + delta);
      return next;
    });
  };

  const reset = () => setCounts(evenSplit(flavours.length, totalCups));

  const handleConfirm = () => {
    const mix = flavours
      .map((f, i) => ({ name: f.node.title, count: counts[i] }))
      .filter((m) => m.count > 0);
    const summary = mix.map((m) => `${m.count}× ${m.name.replace(/^Plant.?Based\s*/i, "")}`).join(", ");
    const attributes: Array<{ key: string; value: string }> = [
      { key: "Mix", value: summary || `${totalCups}× chef's choice` },
    ];
    mix.forEach((m) => {
      attributes.push({ key: m.name, value: String(m.count) });
    });
    onConfirm(attributes);
  };

  const remaining = totalCups - total;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">{t("mix.title")}</DialogTitle>
          <DialogDescription>
            {bundleTitle} — {t("mix.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> {t("mix.loading")}
          </div>
        ) : (
          <>
            <div className="space-y-3 py-2 max-h-[55vh] overflow-y-auto pr-1">
              {flavours.map((f, idx) => {
                const img = f.node.images?.edges?.[0]?.node?.url;
                const cupOverride = getCupImage(f.node.title);
                const cleanTitle = f.node.title.replace(/^Plant.?Based\s*/i, "");
                return (
                  <div key={f.node.id} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                      {cupOverride ? (
                        <img src={cupOverride} alt={cleanTitle} className="w-full h-full object-contain" />
                      ) : img ? (
                        <img src={img} alt={cleanTitle} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{cleanTitle}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => adjust(idx, -1)}
                        disabled={counts[idx] <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold tabular-nums">{counts[idx] ?? 0}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => adjust(idx, 1)}
                        disabled={remaining <= 0}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <button
                type="button"
                onClick={reset}
                className="text-primary hover:underline font-medium"
              >
                {t("mix.reset")}
              </button>
              <span className={`font-semibold ${isValid ? "text-primary" : "text-muted-foreground"}`}>
                {total} {t("mix.of")} {totalCups} {t("mix.cupsLabel")}
              </span>
            </div>

            {!isValid && (
              <p className="text-xs text-destructive">
                {total > totalCups ? t("mix.tooMany") : t("mix.tooFew")}
              </p>
            )}
          </>
        )}

        <DialogFooter>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid || loading || isLoading}
            className="w-full rounded-full font-semibold h-11"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("mix.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MixBuilderDialog;