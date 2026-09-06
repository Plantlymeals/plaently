// Server-only logic for the 199 kr Starter Pack offer.
// The discount itself is a single fixed code created manually in Shopify
// (200 kr off Starter Pack, once per order, one per customer, max 500 uses).
// No Shopify Admin API call happens at runtime for this offer anymore.

export const STARTER_OFFER_LIMIT = 500;

/** Fixed, shared discount code configured directly in Shopify Admin. */
export const STARTER_OFFER_CODE = 'STARTER199';

export type StarterOfferResult =
  | { status: 'issued'; code: string; issued: number; limit: number }
  | { status: 'sold_out'; issued: number; limit: number }
  | { status: 'invalid_email' }
  | { status: 'error'; message: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 255 && EMAIL_RE.test(value);
}

/** Redemptions counted from real Shopify orders via the fulfillment webhook. */
export async function getRedeemedCount(): Promise<{ issued: number; limit: number }> {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { count } = await supabaseAdmin
    .from('starter_offer_redemptions')
    .select('id', { count: 'exact', head: true });
  return { issued: count ?? 0, limit: STARTER_OFFER_LIMIT };
}

export async function issueStarterOffer(rawEmail: string): Promise<StarterOfferResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!isValidEmail(email)) return { status: 'invalid_email' };

  try {
    const { issued, limit } = await getRedeemedCount();
    if (issued >= limit) return { status: 'sold_out', issued, limit };
    return { status: 'issued', code: STARTER_OFFER_CODE, issued, limit };
  } catch (error) {
    console.error('[starter-offer] failed to read redemption count', error);
    return { status: 'error', message: 'offer_unavailable' };
  }
}
