import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const REVIEW_DELAY_DAYS = 5;

async function verifyHmac(rawBody: string, headerHmac: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
  if (computed.length !== headerHmac.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ headerHmac.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const secret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET');
  if (!secret) {
    console.error('SHOPIFY_WEBHOOK_SECRET not configured');
    return new Response('Server not configured', { status: 500, headers: corsHeaders });
  }

  const rawBody = await req.text();
  const headerHmac = req.headers.get('X-Shopify-Hmac-Sha256') ?? '';
  if (!headerHmac || !(await verifyHmac(rawBody, headerHmac, secret))) {
    return new Response('Invalid signature', { status: 401, headers: corsHeaders });
  }

  let payload: any;
  try { payload = JSON.parse(rawBody); } catch {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  const topic = req.headers.get('X-Shopify-Topic') ?? '';
  // We register for orders/fulfilled — payload is an order object.
  const order = payload;
  const email: string | null = order?.email ?? order?.contact_email ?? null;
  const orderId = order?.id ? String(order.id) : null;
  if (!orderId) {
    return new Response(JSON.stringify({ ok: true, skipped: 'no_order_id' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Count Starter Pack offer redemptions from real orders. Idempotent:
  // shopify_order_id is unique, so webhook retries never double-count.
  const STARTER_OFFER_CODE = 'STARTER199';
  const discountCodes = Array.isArray(order?.discount_codes) ? order.discount_codes : [];
  const starterDiscount = discountCodes.find(
    (d: any) => String(d?.code ?? '').trim().toUpperCase() === STARTER_OFFER_CODE,
  );
  if (starterDiscount) {
    const { error: redemptionError } = await supabase.from('starter_offer_redemptions').upsert(
      {
        shopify_order_id: orderId,
        order_number: order?.order_number ? String(order.order_number) : (order?.name ?? null),
        customer_email: email ? email.toLowerCase() : null,
        discount_amount: Number(starterDiscount?.amount) || null,
      },
      { onConflict: 'shopify_order_id', ignoreDuplicates: true },
    );
    if (redemptionError) {
      console.error('Failed to record starter offer redemption', redemptionError, { orderId });
    }
  }

  if (!email) {
    return new Response(JSON.stringify({ ok: true, skipped: 'no_email' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }


  // Skip suppressed addresses
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('email')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (suppressed) {
    return new Response(JSON.stringify({ ok: true, skipped: 'suppressed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const lineItems = Array.isArray(order?.line_items)
    ? order.line_items.map((li: any) => ({
        title: li?.title ?? '',
        product_id: li?.product_id ? String(li.product_id) : null,
        handle: li?.handle ?? null, // not always present; resolved in worker if needed
        quantity: Number(li?.quantity) || 1,
      }))
    : [];

  const sendAt = new Date(Date.now() + REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const firstName: string | null = order?.customer?.first_name ?? null;
  const fullName: string | null = firstName
    ? `${firstName} ${order?.customer?.last_name ?? ''}`.trim()
    : (order?.customer?.email ?? null);

  const { error } = await supabase.from('review_requests').upsert(
    {
      shopify_order_id: orderId,
      order_number: order?.order_number ? String(order.order_number) : (order?.name ?? null),
      customer_email: email.toLowerCase(),
      customer_name: fullName,
      line_items: lineItems,
      send_at: sendAt,
      status: 'scheduled',
    },
    { onConflict: 'shopify_order_id', ignoreDuplicates: true },
  );

  if (error) {
    console.error('Failed to insert review_request', error, { topic, orderId });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, scheduled_for: sendAt }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});