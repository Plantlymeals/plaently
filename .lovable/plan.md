# Tre avgränsade SEO-fixar

## 1. 410 Gone för döda legacy-URL:er

Fil: `src/server.ts`.

Kontrollen läggs allra först i `fetch` — före try/catch-blocket, före anropet till TanStack-handlern och före all asset-hantering (`applyAssetCacheHeaders` körs först efter handlern, så ingen asset-gren kan hinna före).

Matchning sker via `url.searchParams.has(...)` på parameterns existens, inte på hela query-strängen. Alla villkor utvärderas som ett enda OR-uttryck och vid träff returneras svaret omedelbart, så `/?feed=rss2&p=1` och `/?p=1&replytocom=1` fångas.

| Villkor | Exempel |
|---|---|
| `feed` finns (oavsett värde) | `/?feed=rss2` |
| `p` finns och värdet är numeriskt | `/?p=123` |
| `cat` finns | `/?cat=5` |
| `page_id` finns | `/?page_id=2` |
| `replytocom` finns | `/?replytocom=88` |
| path är `/feed/` eller `/comments/feed/` | `/feed/` |

Svar: status `410`, `Content-Type: text/html; charset=utf-8`, minimal body med `<meta name="robots" content="noindex">`. Ingen redirect, ingen SPA-rendering, inga övriga headers.

URL:er utan dessa parametrar påverkas inte — `/` och `/products` fortsätter svara 200. Asset-cache-logiken och felhanteringen i filen lämnas orörda.

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

Raderna för `q`, `s`, `search`, `page`, `feed`, `cat`, `p`, `replytocom`, `/feed/` och `/comments/feed/` tas bort. `Disallow: /*?utm_` behålls.

## 3. Trasig söksmall

Fil: `src/routes/__root.tsx`, `WEBSITE_SCHEMA` (rad 108–112). Hela `potentialAction`-objektet med `SearchAction` tas bort. Kvarvarande objekt behåller `@context`, `@type`, `name`, `alternateName`, `url`, `inLanguage`, `publisher`, utan hängande kommatecken och korrekt stängt (byggs via `JSON.stringify`, så giltigheten verifieras efter ändringen).

`public/sitemap.xml` har ingen `/products?q=`-post och `src/components/SEOHead.tsx` har ingen söksmall — inget att ta bort där.

## Verifiering efter deploy
Mot produktion (`https://plaently.com`) kontrolleras med curl:
- `/?feed=rss2`, `/?feed=rss2&p=1`, `/?p=123`, `/?cat=5`, `/?page_id=2`, `/?replytocom=88`, `/feed/`, `/comments/feed/` → HTTP 410, `text/html`, noindex i body
- `/` och `/products` → HTTP 200 med normalt innehåll
- `/robots.txt` → nytt innehåll ordagrant
- JSON-LD på startsidan → giltigt WebSite-schema utan `potentialAction`

## Avgränsning
Inga andra URL:er, komponenter, texter eller scheman berörs.
