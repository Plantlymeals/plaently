import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

/** Visitor country from the hosting edge geo header (e.g. "SE"). */
export const getVisitorCountry = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequest().headers;
  const country = (
    headers.get('cf-ipcountry') ||
    headers.get('x-vercel-ip-country') ||
    headers.get('x-country-code') ||
    ''
  ).toUpperCase();
  return { country: country && country !== 'XX' ? country : null };
});
