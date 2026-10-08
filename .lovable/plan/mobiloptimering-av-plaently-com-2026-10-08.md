# Mobiloptimering av plaently.com

PageSpeed Insights visar tre flaskhalsar på mobilen: renderingsblockering (~320 ms), 152 KiB oanvänd JavaScript och 7 långa uppgifter på huvudtråden som fördröjer interaktiviteten. Planen åtgärdar dem i prioriterad ordning utan att ändra design eller innehåll.

## 1. Eliminera renderingsblockering (största vinsten, ~320 ms)

**Google Fonts (Poppins)** laddas idag som en blockerande stylesheet i `src/routes/__root.tsx`. Ändras till asynkron inläsning:
- Ladda typsnittet med `media="print" onload="this.media='all'"`-mönstret (eller `rel="preload"` + swap), så texten renderas direkt med det metrisk-matchade reservtypsnittet "Poppins-fallback" som redan finns i `src/styles.css`.
- Behåll `preconnect` till fonts.googleapis.com / fonts.gstatic.com.
- Resultat: första renderingen väntar inte på typsnittet; inget synligt layoutskift tack vare fallback-måtten.

## 2. Minska oanvänd JavaScript (~152 KiB)

- **Dubbla notissystem:** Både `Toaster` (Radix) och `Sonner` monteras i `__root.tsx`. Granska vilken som faktiskt används (sök `toast(`-anrop), ta bort den oanvända och dess beroende ur roten.
- **Katla-scriptet** laddas i head på varje sida — verifiera att det är `async` (det är det) och att GA-loadern förblir konsent-styrd och fördröjd tills efter interaktion, som idag.
- **React.lazy för tunga komponenter under folden** på startsidan (t.ex. MealFinderQuiz, TestimonialsSection, AiAssistantMount) så de inte ingår i första laddningens bundle.

## 3. Korta huvudtrådens långa uppgifter

- Skjut upp icke-kritiska effekter (t.ex. `getVisitorCountry` i `beforeLoad`, newsletter-popup-timer) så de inte blockerar första interaktionen.
- Dela upp eventuella tunga initialiseringar med `requestIdleCallback`/timeout där det är säkert.

## 4. Cachelagring (43 KiB)

- Verifiera att `public/_headers` täcker alla statiska resurser (bilder, favicons) med `Cache-Control: public, max-age=31536000, immutable`. Komplettera vid luckor.

## Verifiering

1. `bunx tsgo --noEmit` och produktionsbygge grönt.
2. Playwright på mobilvy (390x844): startsidan laddar utan visuell regression, typsnittet byts utan layoutskift, cookie-rutan och GA-samtycke fungerar som innan.
3. Ny PageSpeed-körning efter publicering för att mäta förbättringen.

## Tekniska detaljer

- Berörda filer: `src/routes/__root.tsx` (fontladdning, toaster-städning), ev. `src/components/home/*` (lazy), `public/_headers` (cache).
- Ingen ändring av copy, färger, layout eller SEO-metadata.
- Ingen publicering förrän du godkänner efter verifiering i förhandsvisningen.
