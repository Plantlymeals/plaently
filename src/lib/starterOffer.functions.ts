import { createServerFn } from '@tanstack/react-start';

// Public, deliberately narrow entry point for the Starter Pack offer.
// The ONLY client-controlled value is the email address; the discount code
// is a fixed value configured in Shopify Admin. Admin discount management
// stays in shopifyDiscounts.functions.ts behind requireSupabaseAuth + admin role.
export const claimStarterOffer = createServerFn({ method: 'POST' })
  .inputValidator((input: { email: string }) => ({ email: String(input?.email ?? '') }))
  .handler(async ({ data }) => {
    const { issueStarterOffer } = await import('./starterOffer.server');
    return await issueStarterOffer(data.email);
  });

export const getStarterOfferCount = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRedeemedCount } = await import('./starterOffer.server');
  return await getRedeemedCount();
});
