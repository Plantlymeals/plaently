
# Etapp 3 — Blog editorial + bild-SEO + schema

Du har 10 publicerade inlägg (5 EN + 5 SV) i två gamla kategorier: `Lifestyle/Livsstil` och `Nutrition/Näring`. Briefen kräver 8 editoriella kategorier och stramare strukturerad SEO. Här är planen.

## 1. Editorial kategori-arkitektur (8 spår)

Återanvänder befintligt `category`-fält på `blog_posts` — ingen ny tabell. Skriver om de 10 inlägg-kategorierna och förbereder för framtida innehåll.

| EN | SV | Syfte |
|---|---|---|
| Future of Fast Food | Snabbmatens framtid | Kategori-skapande, manifest |
| Modern Nutrition | Modern näring | Protein, fiber, plant protein |
| Fuel Your Day | Energi för dagen | Lunch, kontor, prestation |
| Plant Protein 101 | Plantprotein 101 | Utbildning, källor, kvalitet |
| Behind PLÄNTLY | Bakom PLÄNTLY | Sverige/Italien, hantverk |
| Conscious Living | Medvetet liv | Klimat, hållbarhet, mindset |
| Quick & Real | Snabbt & äkta | Recept, hacks, ritualer |
| Performance & Recovery | Prestation & återhämtning | Träning, kropp |

Mapping av existerande inlägg:
- `best-high-protein-vegan-meals` → **Plant Protein 101**
- `healthy-instant-meals-for-busy-people` → **Fuel Your Day**
- `quick-healthy-lunch-ideas` → **Quick & Real**
- `what-to-eat-for-lunch-at-work` → **Fuel Your Day**
- `why-meal-cups-beat-powders-and-shakes` → **Modern Nutrition** (också: ta bort jämförelse-titel — se p.2)

## 2. Titel- och tonjustering (befintliga inlägg)

- `why-meal-cups-beat-powders-and-shakes` bryter no-comparison-regeln. Byt titel → `The Case for Plant-Based Meal Cups` / `Argumentet för plantbaserade måltidskoppar`. Slug behålls för bakåtkompatibilitet.
- SV-inlägget `darfor-slar-maltidskoppar-pulver-och-shakes` har felaktigt `language:en` i DB — fixas till `sv`.
- Säkerställ att alla SV-titlar använder "plantbaserad" (inte "växtbaserad") — `best-high-protein-vegan-meals-sv` heter "veganska" och bör bli "plantbaserade högprotein-måltider".

## 3. Blog-listan (`/blog`) — kategori-navigation

`src/pages/Blog.tsx` får:
- Kategori-chips överst (8 spår + "All"), filtrerar `posts` med `category` 
- Visar kategori-badge per kort
- BreadcrumbList JSON-LD: Home → Blog
- Behåller befintlig SEO-head

## 4. Per-inlägg schema + interna länkar (`/blog/:slug`)

`src/pages/BlogPost.tsx`:
- Lägg till **BreadcrumbList** schema (Home → Blog → [kategori] → titel)
- Komplettera **BlogPosting** schema: `mainEntityOfPage`, `publisher` (Organization med logo), `dateModified` (från `updated_at`)
- "Related reads"-block under inlägget: 3 inlägg från samma kategori (samma språk)
- Kategori-badge länkar till `/blog?category=...`

## 5. Bild-SEO audit

Beskrivande `alt`-text (idag generiskt eller saknas):
- `src/components/home/HeroSection.tsx` — hero produktbild
- `src/components/home/ProductOverview.tsx` — produktkort
- `src/components/home/LifestyleSection.tsx`, `BundleSection.tsx`, `WhySection.tsx`
- `BlogPost.tsx` `cover_image_url` — använd `post.title` som alt
- `CategoryPage.tsx` hero (om img finns)

Mönster: `"<produktnamn> – plantbaserad måltidskopp med 20g protein"` istället för `"PLÄNTLY product"`.

## 6. Strukturerad data — Product & FAQ

- **`/product/:handle`**: hitta produktsidan (verkar saknas som dedikerad route — produkter renderas via `Products.tsx`). Kolla om Shopify-handles har egen route; om inte, lägg `Product` schema på `Products.tsx`-listan som `ItemList` av produkter och planera dedikerade produktsidor i en framtida etapp.
- **`/faq`**: lägg `FAQPage` JSON-LD från `faqs`-tabellen (om saknas — verifieras i implementation).
- **`/`** (Index): `Organization` + `WebSite` schema med `SearchAction` (sitewide identitet).

## 7. Sitemap

Inga ändringar — `scripts/generate-sitemap.ts` hämtar redan alla publicerade blogginlägg.

## 8. Admin (`AdminBlog.tsx`)

- Kategori-fält byts från fritext-`Input` till `Select` med de 8 EN + 8 SV värdena (auto-mappat på `language`).
- Förhindrar drift; framtida inlägg landar i rätt spår.

## 9. Inte i denna etapp

- Skriva nya blogginlägg (separat content-uppdrag)
- Auto-översättning EN↔SV (kräver process-beslut)
- Dedikerade `/blog/category/[slug]`-sidor (kan komma som Etapp 4 om vi vill ha kategori-arkiv för SEO)

---

## Frågor innan jag kör

1. **Kategori-namn**: OK med listan ovan, eller vill du justera namn? (T.ex. "Quick & Real" → "Recipes & Rituals"?)
2. **Inläggs-omskrivning**: ska jag bara byta titel + språkfält på de problematiska inläggen, eller även skriva om brödtexten (mer jobb)?
3. **Produktsidor**: ska Etapp 3 inkludera att skapa en dedikerad `/product/:handle`-route med Shopify-data + Product schema, eller skjuter vi det till en separat etapp?
4. **Kategori-arkivsidor** (`/blog/future-of-fast-food` etc.): ingår de nu eller senare? De är starka SEO-tillgångar men ~en dags jobb extra.

Säg svar + "kör etapp 3" så bygger jag.
