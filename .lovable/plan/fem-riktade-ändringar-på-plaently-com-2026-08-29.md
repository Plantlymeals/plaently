# Fem riktade ändringar på plaently.com

Endast dessa fem punkter rörs — ingen layout eller styling utanför det som beskrivs.

## 1) Omordning på startsidan + CTA i Problem→Lösning-blocket

**Fil:** `src/pages/Index.tsx`

Nuvarande ordning: Hero → StarterPackHighlight → Trust → ProblemSolution → ProductOverview → NutritionPreview → Why → HowItWorks → Utforska-länkar → Lifestyle → **BundleSection** → Quiz → Testimonials → FinalCTA.

- Flytta `<BundleSection />` från sin LazySection (längst ner) till direkt efter `<ProblemSolution />` och före `<ProductOverview />`, som statisk import-sektion (den hämtar data i useEffect, så den är SSR-säker likt övriga eager-sektioner). Dess LazySection-rad tas bort.
- Ny ordning: Hero → Starter Pack-teaser → Trust → Problem→Lösning → **Paket** → Våra måltider → Näring → Varför PLÄNTLY → Så funkar det → Utforska-länkar → Byggt för moderna livet → Quiz → Testimonials → Slut-CTA. Inget innehåll/styling i sektionerna ändras.

**Fil:** `src/components/home/ProblemSolution.tsx`

- Lägg till en knapp under lösnings-texten i det gröna kortet: text `ps.ctaBundles` = "Välj ditt paket ↓" (sv) / "Choose your pack ↓" (en).
- Samma knappstil som hero-primärknappen: `rounded-full px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90`, storlek `lg`.
- Mjuk scroll: knappen anropar `document.getElementById("paket")?.scrollIntoView({ behavior: "smooth" })`.
- I `BundleSection.tsx` läggs `id="paket"` på sektionens `<section>`-element (endast id, inga klassändringar).

## 2) Pris under hero-knapparna

**Fil:** `src/components/home/HeroSection.tsx`

- Ny rad direkt under knappgruppen, ovanför `<ShippingBadge variant="light" />`:
  `<p className="text-sm font-medium text-primary-foreground/90 [text-shadow:0_1px_8px_hsl(0_0%_0%_/_0.35)]">{t("hero.fromPrice")}</p>`
- Nyckel `hero.fromPrice`: sv "Från 33 kr/kopp", en "From 33 kr/cup". Matchar badge-stilen i hero (mindre än rubriken, samma textskuggade stil).

## 3) "Ingen bindningstid" i paketkorten

**Fil:** `src/components/home/BundleSection.tsx` + `src/lib/i18n.ts`

- Ny nyckel `bundles.feat.noCommitment`: sv "Ingen bindningstid", en "No commitment".
- I `featuresForBundle()`: lägg till `"bundles.feat.noCommitment"` direkt efter `"bundles.feat.delivered"` i listorna för engångspaket (både ≥48 koppar och standard).
- Prenumerationspaket har redan `bundles.feat.cancelAnytime` ("Avsluta när du vill") i motsvarande position — där läggs ingen dublett till.
- Skriver INTE "öppet köp"/returvillkor.

## 4) CTA-verb + quiz-konsekvens

**Fil:** `src/lib/i18n.ts`

- `cta.button`: sv "Handla PLÄNTLY" → "Prova alla fyra smakerna"; en → "Try all four flavours". (Länken `/products` i `FinalCTA.tsx` behålls — endast text byts.)
- `quiz.subtitle` lämnas orörd ("Svara på 3 snabba frågor — vi matchar dig med rätt paket.").
- `quiz.quizDesc`: sv → "Osäker på vilket paket som passar dig? Vi hjälper dig hitta rätt på 3 snabba frågor."; en → "Not sure which pack suits you? We'll help you find the right one in 3 quick questions." (tar bort "30 sekunder").
- `quiz.start`: sv → "Hitta min smak"; en → "Find my flavour".

## 5) Ta bort dubblerade Box-produkter på /products

**Fil:** `src/pages/Products.tsx` (rutnätet i `Products`-komponenten, rad ~348)

Nuvarande filter utesluter redan produkter med kopp-antal i titeln, "taster" och "pack" — men "Bolognese Box" etc. har inget kopp-antal i titeln och slinker igenom.

```diff
  return !getBundleCupsFromTitle(title) && !title.includes("taster") && !title.includes("pack");
+ // samt !title.includes("box")
```

- Lägg till `!title.includes("box")` i samma filter. Kvar blir exakt de 4 enskilda måltiderna.
- `BundleSection` på /products (under rutnätet) påverkas inte — den hämtar paket via egen fråga (`product_type:Bundle OR title:Box`).
- Produktsidorna för boxarna (`/product/bolognese-box-12-cups` m.fl.) finns kvar och indexeras — detta ändrar bara rutnätet på /products.

## Tekniska detaljer

- Nya i18n-nycklar: `ps.ctaBundles`, `hero.fromPrice`, `bundles.feat.noCommitment` — alla med sv + en.
- Inga ändringar i routing, SEO-metadata, schema eller styling-token.

## Verifiering

- Typecheck/build, sedan preview: kontrollera ny ordning på startsidan, mjuk scroll från Problem→Lösning-knappen till Paket, "Från 33 kr/kopp" under hero-knapparna, "Ingen bindningstid"-raden i paketkorten, ny slut-CTA-text, quiz-texter/knapp, samt att /products bara visar 4 kort i övre rutnätet. Diffar visas per punkt innan publicering. Ingen publicering förrän du godkänner.
