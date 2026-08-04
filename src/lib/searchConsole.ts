import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Re-submits the sitemap to Google Search Console.
 * Google removed the anonymous sitemap ping in 2023, so this goes through the
 * authenticated Search Console API in the `gsc-submit-sitemap` edge function.
 * Call it whenever content is published from admin.
 */
export async function submitSitemapToGoogle(options?: { silent?: boolean }) {
  const { data, error } = await supabase.functions.invoke("gsc-submit-sitemap");

  if (error || !data?.submitted) {
    const msg =
      (data as { error?: string } | null)?.error ??
      error?.message ??
      "Kunde inte skicka sitemap till Google";
    if (!options?.silent) toast.error(`Search Console: ${msg}`);
    return { ok: false as const, message: msg };
  }

  if (!options?.silent) toast.success("Sitemap skickad till Google Search Console");
  return { ok: true as const, message: "Sitemap skickad" };
}
