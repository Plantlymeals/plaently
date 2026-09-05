import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

// Public, deliberately narrow entry point for the Starter Pack offer.
// The ONLY client-controlled value is the email address; the discount itself
// is hardcoded server-side. Admin discount management stays in
// shopifyDiscounts.functions.ts behind requireSupabaseAuth + admin role.
export const claimStarterOffer = createServerFn({ method: 'POST' })
  .inputValidator((input: { email: string }) => ({ email: String(input?.email ?? '') }))
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const ip =
      headers.get('cf-connecting-ip') ||
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      'unknown';
    const country = (headers.get('cf-ipcountry') || '').toUpperCase();
    const market: 'SE' | 'EU' = country === 'SE' ? 'SE' : 'EU';

    const { issueStarterOffer } = await import('./starterOffer.server');
    return await issueStarterOffer(data.email, ip, market);
  });

export const getStarterOfferCount = createServerFn({ method: 'GET' }).handler(async () => {
  const { getIssuedCount } = await import('./starterOffer.server');
  return await getIssuedCount();
});
