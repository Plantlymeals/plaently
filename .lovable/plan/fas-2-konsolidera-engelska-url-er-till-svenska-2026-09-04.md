# Fas 2 — konsolidera engelska URL:er till svenska

En URL per sida, på svenska. Språkväxlaren i headern behålls och byter bara text via Zustand-storen.

## 1. 301-omdirigeringar i src/server.ts

En ny konstant-map med de tretton källadresserna och deras svenska mål, plus en kontroll som körs direkt efter 410-kontrollen och före anropet till TanStack-handlern. 410-koden rörs inte.

- Exakt path-matchning mot en `Record<string, string>` (ingen prefixmatchning).
- Trailing slash normaliseras före uppslag, så `/shipping/` träffar.
- Query-strängen bevaras i `Location`, så `/shipping?utm_source=x` → `/frakt?utm_source=x`.
- Ett hopp: målen är slutliga svenska URL:er, ingen kedja.

Blogg: de fem engelska bloggadresserna → sina svenska motsvarigheter (`-sv`-varianterna respektive `/blog/darfor-slar-maltidskoppar-pulver-och-shakes`).
Kategori: `/healthy-fast-food` → `/nyttig-snabbmat`, `/high-protein-meals` → `/proteinrika-maltider`, `/plant-based-meals` → `/plantbaserade-maltider`, `/healthy-instant-meals` → `/halsosamma-snabbmaltider`, `/protein-cups` → `/proteinkoppar`.
Policy: `/shipping` → `/frakt`, `/privacy-policy` → `/integritetspolicy`, `/terms-of-service` → `/kopsvillkor`.

## 2. Ta bort engelska router

Raderas: `src/routes/healthy-fast-food.tsx`, `high-protein-meals.tsx`, `plant-based-meals.tsx`, `healthy-instant-meals.tsx`, `protein-cups.tsx`, `shipping.tsx`, `privacy-policy.tsx`, `terms-of-service.tsx`.

Sidkomponenterna (`CategoryPage.tsx`, `Shipping.tsx`, `Terms.tsx`, `PrivacyPolicy.tsx`) behålls — de används av de svenska routerna. `routeLang`-propen finns kvar men sätts bara till `"sv"`; engelska varianter i innehållsdatan lämnas orörda i denna omgång.

De fem engelska bloggposterna är databasrader, inte route-filer — de fångas av 301-regeln. Deras poster i CMS lämnas orörda (301 svarar före routern).

De tre svenska originalen (`/blog/snabba-proteinrika-luncher-kontoret`, `/blog/vaxtbaserat-protein-guide`, `/blog/om-plantly`) rörs inte.

## 3. Sitemap

`scripts/generate-sitemap.ts` genererar `public/sitemap.xml` vid varje dev/build. Därför ändras båda:

- Ta bort de fem engelska kategori-/policyraderna ur `staticEntries` (`/high-protein-meals`, `/plant-based-meals`, `/healthy-instant-meals`, `/healthy-fast-food`, `/protein-cups`) samt `/shipping`, `/privacy-policy`, `/terms-of-service`.
- Filtrera bort de fem engelska bloggslugarna i `fetchBlogSlugs`, så de inte kommer tillbaka från databasen.
- Regenerera `public/sitemap.xml`; kvar blir svenska URL:er plus produkt- och paketsidor.

## 4. Interna länkar

Pekas om till svenska mål i:

- `src/components/Footer.tsx` (kategorilänkar, shipping, privacy, terms, samt de hårdkodade engelska etiketterna längre ner)
- `src/data/internalLinks.ts` (engelska `path`-värden pekas om till de svenska sluggarna; etiketterna behålls)
- `src/data/categoryContent.ts` (engelska `related`/jämförelselänkar och `enSlugByKey` pekas mot svenska paths)
- `src/components/CookieConsent.tsx` (alltid `/integritetspolicy`)
- `src/lib/legacyRedirects.ts` (`/privacy` → `/integritetspolicy`, `/terms` → `/kopsvillkor`, `/delivery` → `/frakt`) så inga kedjor uppstår

## 5. hreflang och localeAlternates

`src/lib/localeAlternates.ts` tas bort tillsammans med alla referenser:

- `SEOHead.tsx`: `alternates`-propen och hela hreflang-blocket tas bort; `normalizePath` flyttas till en liten lokal hjälpare så canonical fortsätter fungera.
- `categoryHead.ts` och `staticPageHead.ts`: hreflang-länkarna tas bort, canonical behålls (alltid svensk URL).
- `blog_.$slug.tsx`, `products.tsx`, `blog.tsx`, `index.tsx`, `productSeo.ts`: alla `rel="alternate"`-poster tas bort.
- `NoIndexHead.tsx` får `normalizePath` från den nya hjälparen.
- `__root.tsx`: `getPathLocale` ersätts med fast `"sv"` i `<html lang>`.
- `src/lib/localizedRoutes.ts` tas bort och språkväxlarens sister-URL-navigering i `Header.tsx` plockas bort — växlaren byter bara språk i storen.
- Anropande sidor (`CategoryPage.tsx`, `Shipping.tsx`, `Terms.tsx`, `PrivacyPolicy.tsx`, `BlogPost.tsx`) slutar skicka `alternates`.

Efteråt ska ingen `rel="alternate"` finnas kvar i projektet.

## 6. html lang

`<html lang="sv">` på alla sidor — nu som konstant istället för härlett värde.

## Rörs inte

410-regeln, `public/robots.txt`, produkt-/paketsidor under `/product/`, `WEBSITE_SCHEMA` i `__root.tsx`.

## Verifiering

Lokalt: typecheck/build, samt curl mot dev-servern för alla tretton källadresser (301 i ett hopp till rätt svensk URL, inkl. trailing slash och query), att de svenska målen svarar 200, att sitemapen saknar engelska URL:er och att HTML-svaren saknar `rel="alternate"`. Efter publicering upprepas kontrollen mot plaently.com.
