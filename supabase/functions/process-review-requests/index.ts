import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SHOPIFY_STORE_DOMAIN = 'plantly-website-cms-fyvdr.myshopify.com';
const SHOPIFY_ADMIN_API = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07`;
const SITE_ORIGIN = 'https://www.plaently.com';
const FROM_ADDRESS = 'PLÄNTLY <hello@plaently.com>';
const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 25;

function randomCodeSuffix(len = 8): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[buf[i] % alphabet.length];
  return out;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function renderEmail(opts: {
  firstName: string | null;
  items: Array<{ title: string; handle: string | null }>;
  discountCode: string;
  expiresAt: string;
}): { subject: string; html: string } {
  const greeting = opts.firstName ? `How were your meals, ${escapeHtml(opts.firstName)}? 🌱` : 'How were your meals? 🌱';
  const itemButtons = opts.items
    .filter((i) => i.handle)
    .map((i) => `
      <tr><td style="padding:6px 0;">
        <a href="${SITE_ORIGIN}/product/${encodeURIComponent(i.handle!)}?review=1#reviews"
           style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:9999px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;">
          Review ${escapeHtml(i.title)}
        </a>
      </td></tr>`)
    .join('');

  const fallbackCta = itemButtons || `
    <tr><td style="padding:6px 0;">
      <a href="${SITE_ORIGIN}/products"
         style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:9999px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;">
        Leave a review
      </a>
    </td></tr>`;

  const expiresHuman = new Date(opts.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${greeting}</title></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr><td style="background:linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%);border-radius:24px;padding:36px 28px;text-align:center;">
          <p style="margin:0 0 8px 0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#15803d;font-weight:600;">PLÄNTLY</p>
          <h1 style="margin:0;font-size:26px;line-height:1.2;color:#14532d;">${greeting}</h1>
        </td></tr>

        <tr><td style="padding:28px 8px 8px 8px;font-size:16px;line-height:1.6;color:#1f2937;">
          <p style="margin:0 0 14px 0;">Thanks for your order. We hope every cup hit the spot — plant-based protein, fiber-rich, and ready in 3 minutes.</p>
          <p style="margin:0 0 14px 0;">Would you share a quick, honest review? It helps other curious eaters know what to expect.</p>
        </td></tr>

        <tr><td align="center" style="padding:8px 8px 24px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">${fallbackCta}</table>
        </td></tr>

        <tr><td style="padding:0 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border:1px dashed #86efac;border-radius:16px;">
            <tr><td style="padding:22px 20px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;color:#15803d;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">A small thank-you</p>
              <p style="margin:0 0 10px 0;font-size:15px;color:#1f2937;">Here's 10% off your next box, on us.</p>
              <p style="margin:0 0 6px 0;font-size:22px;font-weight:700;letter-spacing:0.08em;color:#14532d;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${escapeHtml(opts.discountCode)}</p>
              <p style="margin:0;font-size:12px;color:#4b5563;">Single-use code · expires ${escapeHtml(expiresHuman)}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:18px 8px 0 8px;">
          <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;text-align:center;">
            Please share your honest opinion — the discount code is yours either way. Reviews are moderated before publishing.
          </p>
        </td></tr>

        <tr><td style="padding:28px 8px 8px 8px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">PLÄNTLY · <a href="mailto:hello@plaently.com" style="color:#15803d;text-decoration:none;">hello@plaently.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject: greeting, html };
}

async function mintDiscountCode(priceRuleId: string, code: string, shopifyToken: string, expiresAtIso: string): Promise<{ ok: boolean; error?: string }> {
  // Set price-rule ends_at to expiration so the child code expires too.
  // We patch only ends_at; other fields remain.
  const patchRes = await fetch(`${SHOPIFY_ADMIN_API}/price_rules/${priceRuleId}.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': shopifyToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ price_rule: { id: Number(priceRuleId), ends_at: expiresAtIso } }),
  });
  if (!patchRes.ok) {
    // non-fatal: continue anyway — rule may already extend past this code's expiry
    console.warn('Failed to update price_rule ends_at', patchRes.status, await patchRes.text());
  }

  const res = await fetch(`${SHOPIFY_ADMIN_API}/price_rules/${priceRuleId}/discount_codes.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': shopifyToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ discount_code: { code } }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Shopify ${res.status}: ${text.slice(0, 300)}` };
  }
  return { ok: true };
}

async function sendViaResend(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const lovable = Deno.env.get('LOVABLE_API_KEY');
  const resend = Deno.env.get('RESEND_API_KEY');
  if (!lovable || !resend) return { ok: false, error: 'Missing email credentials' };

  const res = await fetch('https://connector-gateway.lovable.dev/resend/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lovable}`,
      'X-Connection-Api-Key': resend,
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${text.slice(0, 300)}` };
  }
  return { ok: true };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // Authorize: either internal cron secret OR admin JWT.
  const internalSecret = Deno.env.get('INTERNAL_WEBHOOK_SECRET');
  const providedInternal = req.headers.get('X-Internal-Secret');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let authorized = !!(internalSecret && providedInternal && providedInternal === internalSecret);
  if (!authorized) {
    const auth = req.headers.get('Authorization') ?? '';
    const token = auth.replace('Bearer ', '');
    if (token) {
      const { data: u } = await supabase.auth.getUser(token);
      if (u?.user) {
        const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: u.user.id, _role: 'admin' });
        if (isAdmin) authorized = true;
      }
    }
  }
  if (!authorized) return json({ error: 'Unauthorized' }, 401);

  const priceRuleId = Deno.env.get('SHOPIFY_REVIEW_PRICE_RULE_ID');
  const shopifyToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  if (!priceRuleId || !shopifyToken) {
    return json({ error: 'Shopify credentials not configured' }, 500);
  }

  const { data: due, error: queryErr } = await supabase
    .from('review_requests')
    .select('*')
    .eq('status', 'scheduled')
    .lte('send_at', new Date().toISOString())
    .lt('attempts', MAX_ATTEMPTS)
    .order('send_at', { ascending: true })
    .limit(BATCH_SIZE);

  if (queryErr) return json({ error: queryErr.message }, 500);
  if (!due || due.length === 0) return json({ ok: true, processed: 0 });

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of due) {
    // Suppression re-check (could have been added since scheduling)
    const { data: suppressed } = await supabase
      .from('suppressed_emails')
      .select('email')
      .eq('email', row.customer_email)
      .maybeSingle();
    if (suppressed) {
      await supabase.from('review_requests').update({ status: 'skipped', error: 'suppressed', sent_at: new Date().toISOString() }).eq('id', row.id);
      skipped++;
      continue;
    }

    const code = row.discount_code ?? `PLANTLY-REVIEW-${randomCodeSuffix(8)}`;
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

    if (!row.discount_code) {
      const mint = await mintDiscountCode(priceRuleId, code, shopifyToken, expiresAt);
      if (!mint.ok) {
        await supabase.from('review_requests').update({
          attempts: (row.attempts ?? 0) + 1,
          status: ((row.attempts ?? 0) + 1) >= MAX_ATTEMPTS ? 'failed' : 'scheduled',
          error: mint.error ?? 'discount_mint_failed',
        }).eq('id', row.id);
        failed++;
        continue;
      }
      await supabase.from('review_requests').update({ discount_code: code }).eq('id', row.id);
    }

    const firstName = (row.customer_name ?? '').split(' ')[0] || null;
    const items = Array.isArray(row.line_items) ? (row.line_items as any[]) : [];
    const { subject, html } = renderEmail({
      firstName,
      items: items.map((i) => ({ title: String(i?.title ?? 'your order'), handle: i?.handle ?? null })),
      discountCode: code,
      expiresAt,
    });

    const send = await sendViaResend(row.customer_email, subject, html);
    if (!send.ok) {
      await supabase.from('review_requests').update({
        attempts: (row.attempts ?? 0) + 1,
        status: ((row.attempts ?? 0) + 1) >= MAX_ATTEMPTS ? 'failed' : 'scheduled',
        error: send.error ?? 'send_failed',
      }).eq('id', row.id);
      failed++;
      continue;
    }

    await supabase.from('review_requests').update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      attempts: (row.attempts ?? 0) + 1,
      error: null,
    }).eq('id', row.id);
    sent++;
  }

  return json({ ok: true, processed: due.length, sent, failed, skipped });
});