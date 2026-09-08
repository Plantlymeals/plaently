# Del 7, Steg 2: Tysk produktsidepilot på /de/product/{handle}

Samma fem produkter som den engelska piloten (Starter Pack + fyra smaker), samma säkerhetsspärr: de fyra smakerna startar med `approved: false`, visar svensk originaltext, är `noindex, follow` och ligger utanför sitemapen tills du godkänt den tyska ingrediens-/närings-/allergentexten.

## 1. Ny, smal språktyp för produktsidan

Den globala språkväxlaren i `src/lib/i18n.ts` (`Lang = "sv" | "en"`, ~200 nycklar) rörs inte. Istället:

- Ny typ `ProductPageLocale = "sv" | "en" | "de"` (i i18n.ts, separat från `Lang`).
- Ny ordbok `productPageDe: Record<string, string>` med enbart de nycklar som listats i prompten (52 st).
- `tLocale(key, locale)` utökas: när locale är `"de"` slås nyckeln upp i `productPageDe`, med svenska som fallback om nyckeln saknas — aldrig tom sträng.
- `useLocaleTranslation` tar `ProductPageLocale`.

## 2. Tre-vägs istället för två-vägs

Varje ställe där koden idag frågar "är det engelska, annars svenska" byggs om till att hantera tre språk:

- `src/lib/productSeo.ts`: `de`-fält per produkt i `PRODUCT_SEO` (texterna från punkt 3 i prompten), `productUrl()` får `/de/product/...`, `getProductRouteHead()` väljer copy per locale, `og:locale` får `de_DE`, `getProductSsrCopy()` blir tre-vägs.
- `src/lib/productSchema.ts`: `locale` blir tre-vägs, `inLanguage` får `de-DE`, beskrivningen väljs per språk.
- `src/components/Breadcrumbs.tsx`: rot-crumb får "Startseite".
- `src/pages/Products.tsx`: `pageLocale` läses ur route-kontexten som ett av tre värden (inte bara "är den 'en'"), breadcrumb "Produkte", Starter-Pack-länken pekar på `/de/product/starter-pack-12-cups-1`, `path` i SEOHead får `/de`-prefix, och produkt-HTML:en väljer godkänd tysk text om den finns, annars svenska originalet.
- `src/components/SEOHead.tsx`: `locale` accepterar `de`, `html lang="de"`, `og:locale = de_DE`, keywords faller tillbaka på svenska tills tyska nyckelord finns.
- `CupBadges.tsx`, `SavingsBadge.tsx`, `ProductReviews.tsx`: `locale`-propen byter från `Lang` till `ProductPageLocale` (ingen annan logik ändras).

Hela renderingskedjan för produktsidan gås igenom rad för rad efter fler `=== "sv" ? X : Y` / `=== "en" ? X : Y`-mönster innan bygget anses klart.

### hreflang (högsta risken)

`getProductRouteHead()` slutar använda den booleska `hasEnglishAlternate`. Istället tar den en lista över tillgängliga språk för produkten, t.ex. `["sv", "en"]` eller `["sv", "en", "de"]` när tyskan är godkänd. Alternate-länkarna genereras från listan så att **varje** språkversion pekar på sig själv och på alla andra (sv↔en, sv↔de, en↔de), plus `x-default` mot svenska. Canonical förblir självrefererande per språk. En sida som inte är redo läggs inte in i listan alls — då pekar ingen annan sida på den.

## 3. Nya filer

- `src/data/productCopyDe.ts` — spegel av `productCopyEn.ts`: `DE_PILOT_HANDLES` (samma fem), `DE_PRODUCT_COPY` med de fyra tyska texterna och `approved: false`, `DE_HANDLES_REQUIRING_APPROVAL` (bara de fyra smakerna), `getApprovedDeCopy()`, `hasApprovedDeCopy()`, `needsApprovedDeCopy()`, `isGermanPageReady()`. `<strong>`-taggar sätts tillbaka runt Weizen/Milch inne i ingredienslistorna, precis som i den engelska källan.
- `src/data/productCopyEn.ts` — oberoende faktarättelse: uppdatera `plant-based-fusilli-bolognese`-ingrediensraden till den korrigerade versionen med `texturized pea proteins 21%` och `flavorings`. `approved: true` behålls; näringstabell och allergentext ändras inte.
- `src/routes/de.product.$handle.tsx` — kopia av den engelska routen med `/de/product/$handle`, `pageLocale: "de"`, tysk 404-text ("Produkt nicht gefunden" / "Diese Adresse existiert nicht mehr. Siehe unser gesamtes Sortiment unten." / "Zu den Produkten"), och `noindex` styrt av `isGermanPageReady()`. Handles utanför piloten redirectar 301 till den svenska sidan.

## 4. Sitemap

`scripts/generate-sitemap.ts` får en tysk motsvarighet till `englishPilotEntries()`, med samma högljudda felhantering. Eftersom alla fyra smaker startar med `approved: false` läggs just nu bara Starter Pack-sidan `/de/product/starter-pack-12-cups-1` till — den har ingen egen allergentext och är därför indexerbar direkt, exakt som på engelska.

## 5. Rörs inte

/en/-sidorna, den globala `Lang`/translations-ordboken, sitemap-inskick till Search Console, övriga språk (FR/ES/IT/PL/NL), Shopify, STARTER199, frakt, marknadsdetektering.

## Verifiering innan leverans

- Diff visas, med hreflang-omskrivningen först.
- Typecheck.
- Hämtar serverrenderad HTML för alla tre språkversionerna av en smak och kontrollerar: rätt canonical, ömsesidiga hreflang-par, `de`-sidan har `noindex, follow`, och brödtexten på `/de/` är svensk (inte engelsk).
- Kontrollerar att `/de/product/starter-pack-12-cups-1` renderar tysk UI-text, är indexerbar och finns i sitemapen.
- Kontrollerar att en handle utanför piloten på `/de/` ger 301 till den svenska sidan.

`approved: true` för de fyra smakerna sätts först efter din skriftliga bekräftelse.
