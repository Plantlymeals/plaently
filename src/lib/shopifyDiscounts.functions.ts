import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { DiscountAction } from './shopifyDiscounts.server';

export const manageShopifyDiscounts = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: DiscountAction) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
    if (!isAdmin) throw new Error('Forbidden');

    const { runDiscountAction } = await import('./shopifyDiscounts.server');
    return await runDiscountAction(data, userId);
  });
