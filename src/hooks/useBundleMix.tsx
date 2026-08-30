import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

// Filterlogiken är flyttad till den delade modulen productFilters.ts —
// re-exporteras här för befintliga importörer. Ändra villkoren där, inte här.
export { getBundleCupsFromTitle } from "@/lib/productFilters";

export function useBundleMix() {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ShopifyProduct | null>(null);
  const [cups, setCups] = useState(0);
  const [mixableNames, setMixableNames] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  useEffect(() => {
    supabase
      .from("bundles")
      .select("name,is_mixable")
      .then(({ data }) => {
        if (!data) return;
        setMixableNames(
          new Set(
            data
              .filter((b: any) => b.is_mixable)
              .map((b: any) => String(b.name).toLowerCase())
          )
        );
      });
  }, []);

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
      ...(attributes ? { attributes } : {}),
    });
    toast.success(t("products.addedToCart"), { position: "top-center" });
  };

  const handleAdd = async (product: ShopifyProduct) => {
    const title = product.node.title.toLowerCase();
    const c = getBundleCupsFromTitle(product.node.title);
    const isMixable = Array.from(mixableNames).some((n) => title.includes(n));
    if (isMixable && c && c > 1) {
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
      bundleTitle: active?.node.title || "",
      totalCups: cups,
      isLoading,
      onConfirm,
    },
  };
}
