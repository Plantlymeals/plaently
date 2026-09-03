# Fix: sv/en-sidpar visar fel språk i innehållet

## Verifierat i koden

- `src/lib/i18n.ts` (rad 473–501): `useLangStore` har `lang: "sv"` som default och persistas i localStorage (`plantely-lang`). `useTranslation()` returnerar det globala värdet.
- `src/pages/categories/CategoryPage.tsx` rad 20–21: `const { lang } = useTranslation(); const c = getCategoryContent(categoryKey, lang);` — innehållet styrs alltså av storen, inte av URL:en.
- Alla 5 kategoriroutefiler (t.ex. `high-protein-meals.tsx`, `proteinrika-maltider.tsx`) skickar rätt språk till `buildCategoryHead(key, lang)` men renderar `<CategoryPage categoryKey="..." />` utan språk. Bekräftat: title/meta är korrekt per URL, brödtexten är det inte.
- `src/routes/frakt.tsx`, `shipping.tsx`, `kopsvillkor.tsx`, `terms-of-service.tsx` saknar helt `head()` — endast `component: Shipping/Terms`. `Shipping.tsx` rad 161 och `Terms.tsx` rad 82 gör `const isEn = lang !== "sv"` från den globala storen, och även `path`/`alternates`/canonical härleds därifrån — så canonical kan peka på fel URL.
- `src/components/Header.tsx` rad 27: `toggleLang` flippar bara den globala flaggan, ingen navigering till systersidan.

## Vad som ändras

### 1. Kategoriroutes skickar språk vidare (5 par, 10 filer)
`high-protein-meals.tsx`, `proteinrika-maltider.tsx`, `healthy-fast-food.tsx`, `nyttig-snabbmat.tsx`, `healthy-instant-meals.tsx`, `halsosamma-snabbmaltider.tsx`, `plant-based-meals.tsx`, `plantbaserade-maltider.tsx`, `protein-cups.tsx`, `proteinkoppar.tsx`:

```tsx
component: () => <CategoryPage categoryKey="high-protein-meals" routeLang="en" />
```

(samma `lang`-värde som redan går till `buildCategoryHead`).

### 2. `src/pages/categories/CategoryPage.tsx`
- Ny prop `routeLang: Lang` (obligatorisk).
- `const c = getCategoryContent(categoryKey, routeLang);`
- Alla `lang === "sv" ? ... : ...` i sidinnehållet (rad 91–193: breadcrumbs, CTA-text, "Vanliga frågor", "Utforska mer") byter till `routeLang`.
- `SEOHead locale={routeLang}`; hreflang-listan är redan URL-baserad och rörs inte.
- Global store fortsätter styra header/footer.

### 3. `src/pages/Shipping.tsx` och `src/pages/Terms.tsx`
- Ny prop `routeLang: Lang`; `const isEn = routeLang === "en"` ersätter `lang !== "sv"`.
- `path`, `alternates`, `privacyPath`, `jsonLd.inLanguage`, `marketLabel()` följer med automatiskt.
- `ogTitle`/`ogDescription` som idag är hårdkodade till `COPY.sv` blir språkriktiga.

### 4. Route-specifik `head()` för frakt/shipping och köpvillkor/terms
Ny hjälpfil `src/lib/staticPageHead.ts` i samma stil som `categoryHead.ts`:
`buildStaticPageHead({ svPath, enPath, lang, title, description, noindex })` som returnerar title, description, robots, og:*, twitter:*, canonical (self) och hreflang sv/en/x-default (x-default = sv, som kategorisidorna).

- `frakt.tsx` → `head: () => buildStaticPageHead(shippingHead("sv"))`, `component: () => <Shipping routeLang="sv" />`
- `shipping.tsx` → samma med `"en"`
- `kopsvillkor.tsx` / `terms-of-service.tsx` → samma mönster, behåller `noindex`
- Titel/description hämtas från en delad COPY-källa så SSR-head och sidan inte kan glida isär (flyttar `COPY.seoTitle`/`seoDesc` till en exporterad konstant).
- `SEOHead` i dessa sidor sätts till `routeOwnsMetadata`/`routeOwnsLinks` för att undvika dubbletter, precis som kategorisidorna gör.

### 5. `src/components/Header.tsx` — språkväxlaren navigerar
- Bygg en URL-karta för de språkade sidparen (5 kategorisidor + frakt/shipping + kopsvillkor/terms + redan befintliga privacy-paren).
- Vid klick: sätt `setLang(next)` **och** navigera till systersidan om nuvarande pathname finns i kartan; annars bara flippa flaggan som idag.

## Tekniska noter
- Ingen ändring av default `lang: "sv"` i storen — bara att sidinnehåll för språkade URL:er inte längre läser den.
- Inga URL:er ändras, inga redirects, ingen sitemap-ändring behövs.
- Verifiering efter build: `curl` mot varje engelsk URL och kontrollera att H1/brödtext i rå HTML är engelsk och att canonical/hreflang pekar rätt; samma för svenska motsvarigheten.
