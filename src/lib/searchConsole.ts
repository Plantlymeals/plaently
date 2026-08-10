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

let pendingTimer: ReturnType<typeof setTimeout> | null = null;
let lastSubmit = 0;
const DEBOUNCE_MS = 3000;
const MIN_INTERVAL_MS = 60_000;

/**
 * Call after ANY CMS publish/edit/delete. Debounced so a burst of admin edits
 * results in a single Search Console submission, and rate-limited to once a
 * minute. The sitemap itself is generated live by the `sitemap` edge function,
 * so this only nudges Google to re-crawl it.
 */
export function notifySitemapChanged() {
  if (pendingTimer) clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    const now = Date.now();
    if (now - lastSubmit < MIN_INTERVAL_MS) return;
    lastSubmit = now;
    void submitSitemapToGoogle({ silent: true });
  }, DEBOUNCE_MS);
}
