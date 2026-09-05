# Rensa strukturerad data på startsidan

## 1. Ta bort SearchAction ur WEBSITE_SCHEMA
Fil: `src/routes/__root.tsx`

Ta bort hela `potentialAction`-objektet ur konstanten `WEBSITE_SCHEMA`. Kvarvarande fält: `@context`, `@type`, `name`, `alternateName`, `url`, `inLanguage`, `publisher`.

Efteråt ska strängen `search_term_string` inte finnas kvar någonstans i projektet.

## 2. Ta bort HOME_SCHEMA och flytta foundingDate till ORG_SCHEMA
Filer: `src/routes/index.tsx`, `src/pages/Index.tsx`, `src/routes/__root.tsx`

Startsidan renderar i dag tre JSON-LD-block. Block 3 (`HOME_SCHEMA`) är en `@graph` som duplicerar Organization och WebSite från `__root.tsx`. Enda unika fältet i `HOME_SCHEMA` är `foundingDate: "2025"`.

Åtgärder:
- Lägg till `"@id": "https://plaently.com/#organization"` och `foundingDate: "2025"` i `ORG_SCHEMA` i `__root.tsx`.
- Ta bort importen av `HOME_SCHEMA` från `src/routes/index.tsx`.
- Ta bort `scripts`-posten med `JSON.stringify(HOME_SCHEMA)` i `src/routes/index.tsx`.
- Ta bort konstanten `HOME_SCHEMA` från `src/pages/Index.tsx` (används bara där).

## 3. Koppla ihop WebSite och Organization med @id
Fil: `src/routes/__root.tsx`

- Lägg till `"@id": "https://plaently.com/#website"` i `WEBSITE_SCHEMA`.
- Ersätt `WEBSITE_SCHEMA.publisher` med `{ "@id": "https://plaently.com/#organization" }` så att WebSite refererar till den fullständiga Organization-entiteten i stället för att duplicera ett halvt objekt.

## Rör inte
- `src/server.ts` (410-regeln och 301-blocket)
- `public/robots.txt`
- Sitemap-genereringen

## Verifiering
- Startsidan renderar exakt två JSON-LD-block, inte tre.
- Ingen förekomst av `search_term_string` i projektet.
- `ORG_SCHEMA` innehåller: `legalName`, fyra `alternateName`, fyra `sameAs`, `address`, `logo`, `email`, `description`, `foundingDate`, `@id`.
- `WEBSITE_SCHEMA.publisher` är en `{ "@id": ... }`-referens.
- Båda blocken parsar som giltig JSON.
