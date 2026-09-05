# Ta bort trasig söksmall ur WebSite-schemat

## 1. Ta bort SearchAction från WebSite-schemat
Fil: `src/routes/__root.tsx`

Ta bort hela `potentialAction`-objektet ur konstanten `WEBSITE_SCHEMA`. Kvarvarande fält: `@context`, `@type`, `name`, `alternateName`, `url`, `inLanguage`, `publisher`.

## 2. Ta bort det tredje JSON-LD-blocket utan @type
Fil: `src/routes/index.tsx`

Startsidan renderar i dag tre JSON-LD-block:
1. `ORG_SCHEMA` (Organization) från `__root.tsx`
2. `WEBSITE_SCHEMA` (WebSite) från `__root.tsx`
3. `HOME_SCHEMA` från `index.tsx`

`HOME_SCHEMA` består av en `@graph` som innehåller ytterligare en Organization och en WebSite — dubletter av block 1 och 2 — och har själv ingen `@type` på toppnivå. Det är det blocket Google rapporterar som strukturerad data utan typ.

Åtgärd: ta bort importen av `HOME_SCHEMA` från `src/pages/Index` och ta bort `scripts`-posten med `JSON.stringify(HOME_SCHEMA)` i `src/routes/index.tsx`.

## 3. Verifiering
- Kör en global sökning efter `search_term_string` — endast kvarvarande förekomst ska vara borta.
- Kontrollera att alla JSON-LD-block på startsidan parsar som giltig JSON och har en `@type`.
- Kontrollera att `src/server.ts`, `public/robots.txt` och sitemap-genereringen inte rörs.

## Teknisk motivering
SearchAction med bokstavligen `{search_term_string}` har fått Google att försöka hämta en ogiltig URL. Samtidigt är `@graph`-blocket på startsidan redundant eftersom samma entiteter redan serveras via `__root.tsx`, och dess avsaknad av toppnivå-`@type` ger ett valideringsfel.
