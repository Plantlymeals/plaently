import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

const BUNDLE_KEYS = ["big office", "office", "monthly", "athlete", "starter"] as const;
const CUPS: Record<string, number> = {
  starter: 12, athlete: 24, monthly: 24, office: 48, "big office": 120,
};

export function getBundleCupsFromTitle(title: string): number | null {
  const lower = title.toLowerCase();
  const key = BUNDLE_KEYS.find((k) => lower.includes(k));
  return key ? CUPS[key] : null;
}

export function useBundleMix() {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ShopifyProduct | null>(null);
  const [cups, setCups] = useState(0);
  const { t } = useTranslation();

  const addPlain = async (
    product: ShopifyProduct,
    attributes?: Array<{ key: string; value: string }>
  ) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
      attributes,
    });
    toast.success(t("products.addedToCart"), { position: "top-center" });
  };

  const handleAdd = async (product: ShopifyProduct) => {
    const c = getBundleCupsFromTitle(product.node.title);
    if (c && c > 1) {
      setActive(product);
      setCups(c);
      setOpen(true);
    } else {
      await addPlain(product);
    }
  };

  const onConfirm = async (attrs: Array<{ key: string; value: string }>) => {
    if (!active) return;
    await addPlain(active, attrs);
    setOpen(false);
    setActive(null);
  };

  return {
    handleAdd,
    isLoading,
    dialogProps: {
      open,
      onOpenChange: (o: boolean) => {
        setOpen(o);
        if (!o) setActive(null);
      },
      bundleTitle: active?.node.title.replace(/—.*$/, "").trim() || "",
      totalCups: cups,
      isLoading,
      onConfirm,
    },
  };
}
