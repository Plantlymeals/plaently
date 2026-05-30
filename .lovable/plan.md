
# PLÄNTLY — Healthy Fast Food repositionering

Briefen är stor. Jag delar upp den i 3 etapper så vi kan godkänna och verifiera varje steg innan vi går vidare. Jag föreslår att vi börjar med **Etapp 1** nu.

## Brand-regler (gäller alla etapper)

- Ingen jämförelse: ta bort "better than / vs / alternative to".
- Använd **"plant protein / plant-based"**, undvik "vegan" (matchar projektets minne).
- Hero-känsla: editorial, kategoriskapande, Apple x Nike x Oatly.

---

## Etapp 1 — Foundational SEO + Homepage (gör nu)

**Filer som ändras:**

1. `index.html`
   - Title: `Healthy Fast Food | 20g Protein Meals in 5 Minutes | PLÄNTLY`
   - Meta description: `20g plant protein meals ready in 5 minutes. Developed in Sweden and crafted in Italy. Healthy fast food without compromise.`
   - Uppdatera keywords, OG-title/description.
   - Lägg till `keywords` med EN + SV kategori-termer.

2. `src/pages/Index.tsx` (SEOHead)
   - Samma title/description som ovan, så Helmet matchar.

3. `src/lib/i18n.ts` (hero-texter — UI följer SEO)
   - `hero.headline`: `Healthy Fast Food.` (EN) / `Hälsosam snabbmat.` (SV)
   - `hero.subheadline`: `20g plant protein. Ready in 5 minutes. Developed in Sweden, crafted in Italy.`
   - CTA: `Shop Meals` / `Discover PLÄNTLY`
   - (Endast om du säger ja — detta ändrar synligt UI.)

4. Ny route + sida `/healthy-fast-food`
   - Återanvänder `CategoryPage` + ny key `healthy-fast-food` i `categoryContent.ts`.
   - Sätter PLÄNTLY som kategori-ägare för termen.

5. Sitemap: lägg till `/healthy-fast-food`.

---

## Etapp 2 — Kategorisidor + Protein Cups

- Skriv om `categoryContent.ts` för `high-protein-meals`, `plant-based-meals`, `healthy-instant-meals` med ny editorial ton (ta bort kvarvarande jämförelsespråk, justera H1/H2 enligt briefen).
- Lägg till ny kategori `/protein-cups`.
- Internlänkning mellan kategorisidorna och från homepage.
- Breadcrumb-schema på varje kategori.

## Etapp 3 — Blog editorial + bild-SEO + schema

- Blog-arkitektur: 8 editorial-kategorier (Future of Fast Food, Modern Nutrition, etc.) — som taggar i admin, inte ny CMS-struktur.
- Bild-alt-text audit på `ProductOverview`, `HeroSection`, blog.
- Lägg till Product schema på `/product/:handle` och FAQ schema på `/faq` (om saknas).

---

## Frågor innan jag kör Etapp 1

1. **Hero-texten på startsidan**: ska jag byta ut nuvarande hero-headline mot `Healthy Fast Food.` / `Hälsosam snabbmat.`? Detta är ett synligt UI-byte.
2. **Språk för title/meta**: behåller vi engelsk title (`Healthy Fast Food | …`) även på sv-versionen, eller vill du ha svensk title (`Hälsosam snabbmat | 20g protein på 5 minuter | PLÄNTLY`)? Domänen är .com men huvudtrafik är SE.

Säg "kör etapp 1" + svar på frågorna så bygger jag direkt.
