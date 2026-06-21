## Goal

Send a branded "leave a review" email **5 days** after Shopify marks an order as fulfilled. Each email contains a unique single-use 10%-off discount code (60-day expiry) and a per-product review link that deep-links to the existing review form.

## Flow

```text
Shopify order fulfilled
        │ webhook (HMAC-signed)
        ▼
edge: shopify-fulfillment-webhook
  - verify HMAC
  - insert row into review_requests (status=scheduled, send_at=now+5d)
        │
        ▼ (pg_cron every 15 min)
edge: process-review-requests
  - pick rows where send_at <= now and status=scheduled
  - create unique Shopify discount code via Admin API
  - send email via Resend (one per order, listing all line items)
  - mark status=sent
```

## Pieces to build

1. **Migration** — `review_requests` table:
   `id, shopify_order_id (unique), customer_email, customer_name, line_items jsonb, discount_code, send_at, status (scheduled|sent|failed|skipped), error, attempts, created_at, sent_at`. RLS: service-role only writes, admins can read. GRANTs included.

2. **Shared Shopify price rule** — created once via `shopify--create_price_rule`: 10% off entire order, one-use per code, min spend 0. Its ID is stored as secret `SHOPIFY_REVIEW_PRICE_RULE_ID` so the worker mints child codes against it.

3. **Edge function `shopify-fulfillment-webhook`** (verify_jwt = false):
   - Verifies `X-Shopify-Hmac-Sha256` against `SHOPIFY_WEBHOOK_SECRET`.
   - On `orders/fulfilled`: upsert row with `send_at = now + 5 days`, dedupe on `shopify_order_id`.
   - Skips orders with no customer email or addresses already in `suppressed_emails`.

4. **Edge function `process-review-requests`** (scheduled via pg_cron every 15 min):
   - Reads due rows.
   - Mints `PLANTLY-REVIEW-{8 random chars}` via Shopify Admin API using existing `SHOPIFY_ACCESS_TOKEN`.
   - Sends email via Resend gateway with `from: "PLÄNTLY <hello@plaently.com>"`.
   - Marks sent / failed (retry cap 3).

5. **Email template** (inline HTML, PLÄNTLY green gradient, Poppins-fallback):
   - Subject: "How were your meals, {{firstName}}? 🌱"
   - Body: thanks → per-product "Leave a review" buttons → discount code block ("Here's 10% off your next box — code expires in 60 days") → small "Reviews must be honest — the code is yours either way" disclaimer.

6. **Frontend tweak** — `src/pages/Products.tsx` (product detail): when `?review=1` is in URL, scroll to `#reviews` and auto-open the review form. Presentation-only.

7. **Cron** — `pg_cron` job calling `process-review-requests` every 15 minutes using the standard `net.http_post` pattern with `INTERNAL_WEBHOOK_SECRET` header.

8. **Webhook registration** — one-time: I'll surface the webhook URL + the value to paste into Shopify Admin → Settings → Notifications → Webhooks (topic: `orders/fulfilled`, format JSON), then add the secret via `add_secret`.

## Secrets to add

- `SHOPIFY_WEBHOOK_SECRET` — pasted from Shopify after webhook creation.
- `SHOPIFY_REVIEW_PRICE_RULE_ID` — set after creating the price rule.

`RESEND_API_KEY`, `SHOPIFY_ACCESS_TOKEN`, `INTERNAL_WEBHOOK_SECRET` already exist.

## Out of scope

- No marketing/bulk sends, no nag-resends.
- No changes to review moderation (`/admin/reviews` stays).
- No per-user OAuth, no attachments.

Approve and I'll build it.