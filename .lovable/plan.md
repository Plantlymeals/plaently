# Tre avgränsade SEO-fixar

## 1. 410 Gone för döda legacy-URL:er

`src/server.ts` — lägg till en kontroll allra först i `fetch`, före anropet till TanStack-handlern (SPA/SSR-fallbacken), som returnerar 410 utan att rendera något.

Träffar (matchning på parameterns existens via `searchParams.has`, inte på hela query-strängen, så `/?feed=rss2&p=1` fångas):

| Villkor | Exempel |
|---|---|
| `feed` finns (oavsett värde) | `/?feed=rss2` |
| `p` finns och värdet är numeriskt | `/?p=123` |
| `cat` finns | `/?cat=5` |
| `page_id` finns | `/?page_id=2` |
| `replytocom` finns | `/?replytocom=88` |
| path är `/feed/` eller `/comments/feed/` | `/feed/` |

Svar: status `410`, `Content-Type: text/html; charset=utf-8`, minimal body med `<meta name="robots" content="noindex">`. Ingen redirect, ingen SPA-rendering, inga övriga headers ändras. Asset-cache-logiken och felhanteringen i filen lämnas orörda.

## 2. robots.txt

`public/robots.txt` ersätts i sin helhet med exakt:

```
User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /mcp
Disallow: /unsubscribe
Disallow: /*?utm_

Sitemap: https://plaently.com/sitemap.xml
```

Raderna för `q`, `s`, `search`, `page`, `feed`, `cat`, `p`, `replytocom`, `/feed/` och `/comments/feed/` tas bort så att Google får crawla dem och se 410:an.

## 3. Trasig söksmall

`search_term_string` finns på exakt ett ställe i projektet: `WEBSITE_SCHEMA` i `src/routes/__root.tsx` (rad 108–112). Hela `potentialAction`-objektet med `SearchAction` tas bort; resten av WebSite-schemat är oförändrat.

`public/sitemap.xml` innehåller ingen `/products?q=`-post och `src/components/SEOHead.tsx` innehåller ingen söksmall — inget att ta bort där.

## Avgränsning
Inga andra URL:er, komponenter, texter eller scheman berörs.
