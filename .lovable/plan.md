# Riktiga engelska kategorisidor

Kopplar in den engelska texten som redan finns för de fyra kategorisidorna, så att engelska sökord har en egen sida att ranka på. Ingen ny text skrivs.

## Vad som byggs

1. **Fyra nya engelska sidor**: `/en/high-protein-meals`, `/en/healthy-fast-food`, `/en/plant-based-meals`, `/en/protein-cups` — samma upplägg som de svenska, men med engelskt innehåll.
2. **Rätt kanonisk adress och språktaggar**: varje engelsk sida pekar på sig själv; de svenska behåller sin egen adress. Alla åtta sidor får hreflang sv / en / x-default (svenska som x-default).
3. **"Explore more"** på engelska sidor länkar till de andra engelska sidorna.
4. **Sajtkartan** får fyra nya adresser (61 → 65).

## En lucka utöver prompten

Det engelska innehållet har fältet `slug` satt till den svenska adressen. Sidan använder det för brödsmulan och klientens SEO-komponent, så den engelska sidans brödsmula skulle leda till den svenska sidan. Jag rättar detta i sidkomponenten genom att använda `/en/<key>` när språket är engelska — ingen ändring av sidans struktur eller den svenska texten.

## Rörs inte

Svenska routefiler, svensk copy, `svSlugByKey`, `relatedSv()`, de gamla 301:orna utan `/en/` i server-filen, produktsidor, sidfot, priser, kassa.

## Tekniska detaljer

- Nya filer: `src/routes/en.high-protein-meals.tsx`, `en.healthy-fast-food.tsx`, `en.plant-based-meals.tsx`, `en.protein-cups.tsx` — `buildCategoryHead(key, "en")` + `<CategoryPage routeLang="en" />`.
- `src/lib/categoryHead.ts`: `svUrl = BASE/svSlug`, `enUrl = BASE/en/key`; `selfUrl` beror på `lang` (canonical + og:url); lägg till `alternate` hreflang sv, en, x-default (samma form som `getProductRouteHead`). `og:locale` en_GB för en.
- `src/data/categoryContent.ts`: `relatedEn()` → `/en/...`-slugs, filter `/en/${exclude}`.
- `src/pages/categories/CategoryPage.tsx`: `pagePath = lang === "en" ? /en/${categoryKey} : /${c.slug}` för brödsmula och SEOHead `path`.
- `scripts/generate-sitemap.ts`: fyra rader i `staticEntries` med samma priority/changefreq som svenska syskon; regenerera `public/sitemap.xml` med bun.
- Kontrollera att server-filens 410-/lowercase-/redirectregler inte fångar `/en/<kategori>`.

## Verifiering före publicering (rapporteras med resultat)

1. Bygget är rent.
2. Rå server-HTML för alla fyra `/en/...` visar engelsk H1, intro, FAQ.
3. Canonical på `/en/...` = egen adress; svenska canonicals oförändrade.
4. Alla åtta sidor har hreflang sv/en/x-default mot rätt adresser.
5. "Explore more" och brödsmula på engelska sidor pekar på `/en/...`.
6. `/high-protein-meals` m.fl. (utan `/en/`) 301:ar fortfarande till svenska sidan.
7. Sajtkartan innehåller de fyra nya adresserna (65 totalt).

Publicering sker först efter ditt godkännande av verifieringen.
