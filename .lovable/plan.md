# Sticky mobil-CTA-bar

En fast CTA-bar längst ner på skärmen, synlig endast på mobil (<640px), som visas efter att besökaren scrollat förbi hero-sektionen.

## Vad som byggs

1. **Ny komponent** `src/components/home/StickyMobileCta.tsx`:
   - `fixed bottom-0 inset-x-0`, klassen `sm:hidden` (samma 640px-brytpunkt som headerns "Handla nu"-knapp som använder `hidden sm:inline-flex`).
   - Vänster: pristext via befintlig i18n-nyckel `hero.fromPrice` ("Från 33 kr/kopp" / "From 33 kr/cup") — återanvänder redan översatt text, ingen ny copy.
   - Höger: knapp "Välj paket" (sv) / "Choose bundle" (en) — nya i18n-nycklar `cta.choosePackage` i `src/lib/i18n.ts`. Knappen kör `document.getElementById("paket")?.scrollIntoView({ behavior: "smooth" })` mot befintliga `id="paket"` i BundleSection.
   - Synlighetslogik: scroll-lyssnare (passiv, med rAF-throttle) jämför `window.scrollY` mot hero-sektionens nederkant (`document.querySelector("section.gradient-hero")` + offsetHeight). Baren renderas med translate/opacity-transition: dold nedanför skärmen tills man scrollat förbi hero, glider in, glider ut igen högst upp. Inga krockar med hero-knapparna.
   - Styling: sajtens mörka fasta bakgrund (samma palett som BundleSection, `#0a0a0a`), vit text, `shadow-[0_-4px_16px_rgba(0,0,0,0.25)]` upptill, `z-40` (över innehåll, under modaler som använder `z-[100]`/`z-[101]`), `padding-bottom: env(safe-area-inset-bottom)` för iOS home indicator. Knappen återanvänder sajtens `Button`-komponent (rounded-full, primary) för konsekvent stil.
   - SSR-säker: scroll-lyssnaren sätts upp i `useEffect`, initialt dold vid serverrendering (ingen hydration-mismatch).

2. **Montering** i `src/pages/Index.tsx` (startsidan): `<StickyMobileCta />` läggs sist inuti `Layout`, utanför sektionsflödet (fixed-position påverkar inte layouten). Endast startsidan får baren — inga andra sidor rörs.

3. **Inget annat ändras** — ingen layout, styling eller innehåll påverkas utanför den nya baren.

## Verifiering före publicering

- Sätta preview till mobilvy och skärmdumpa: baren dold högst upp, synlig efter scroll förbi hero, knappen scrollar mjukt till Paket-sektionen.
- Kontrollera att baren inte täcker footerns innehåll (ev. safe-padding om det behövs — rapporteras isåfall innan ändring).
- Publiceras inte förrän du godkänt förhandsgranskningen.

## Tekniska detaljer

- Berörda filer: `src/components/home/StickyMobileCta.tsx` (ny), `src/pages/Index.tsx` (en monteringsrad), `src/lib/i18n.ts` (två nya nycklar sv/en).
- z-index-skala i projektet: modaler 100–101, så baren får 40.
- Brytpunkt: Tailwind `sm:` = 640px, samma som headern.
