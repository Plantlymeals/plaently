# Del 3 + Del 4 — sex avgränsade ändringar

Rör inte: 410-regeln, 199 kr-erbjudandets backend, admin-panelens auktorisering, `routeLang`-strukturen.

## Steg 1 — 301: /halsosamma-snabbmaltider → /nyttig-snabbmat

- Ny rad i `PERMANENT_REDIRECTS` (`src/server.ts`).
- Viktigt: raden `/healthy-instant-meals` → `/halsosamma-snabbmaltider` finns redan. Om den lämnas orörd blir det en kedja på två hopp. Jag pekar därför om den direkt till `/nyttig-snabbmat` (enda ändringen i en befintlig rad, för att hålla ett hopp per omdirigering).
- Ta bort sidan ur sitemap-genereringen (`scripts/generate-sitemap.ts`, `supabase/functions/sitemap/index.ts`, `public/sitemap.xml`) och ta bort ruttfilen `src/routes/halsosamma-snabbmaltider.tsx`.
- Peka om interna länkar direkt: `src/components/Footer.tsx` (3 ställen), `src/data/internalLinks.ts`, `src/data/categoryContent.ts` (relaterade-länkar och slug-mappning).

## Steg 2 — Fas 2-städning

- `__root.tsx`: `inLanguage` blir bara `"sv-SE"`.
- `AdminBlog.tsx`: nya inlägg defaultar till `language: "sv"`.
- `PrivacyPolicy.tsx`: självreferensen till `plaently.com/privacy-policy` byts till `/integritetspolicy`; död `isEn`-kod (alltid `false`) tas bort.
- Döda `isEn`-grenar i `Shipping.tsx` och `Terms.tsx` samt engelska innehållsblock i `categoryContent.ts` tas bort. `routeLang` som struktur lämnas orörd.
- Bloggens hreflang: bekräftas borta sedan Fas 2 (kontrolleras, ingen ändring om den redan är borta).

## Steg 3 — Kundvagn: konkret rekommendation vid fri frakt-baren

Under progressbaren i `CartDrawer.tsx`, när det fattas belopp till fri frakt:

- Räkna ut hur många enskilda koppar à 39 kr som täcker mellanskillnaden.
- Fattas det 160 kr eller mer: rekommendera **Starter Pack (12 måltider, 399 kr)** som ett klick.
- Fattas det mindre: rekommendera **närmaste enskilda kopp** med antal, t.ex. "Lägg till 2 × Fusilli Bolognese (78 kr) så blir frakten fri" med en lägg-till-knapp.
- Ren frontend mot befintlig katalog, ingen ny data.

## Steg 4 — Produktsida: uppsälj mot Starter Pack

Exakt text (svenska): **"Spara ~15 % med Starter Pack — 12 måltider för 399 kr, 33 kr per måltid i stället för 39 kr."** med knappen "Se Starter Pack" som länkar till Starter Pack-produktsidan. Visas inte på Starter Pack-sidan själv.

## Steg 5 — "Begränsat erbjudande"-badgen

Badgen (`starter.badge`) kopplas till samma `getStarterOfferCount` som popupen och visar "Begränsat erbjudande · X av 500 kvar". Går kopplingen inte i det här steget tas ordet "begränsat" bort.

## Steg 6 — detectMarket()s SSR-flimmer

- Läs besökarens land på servern via befintliga `getVisitorCountry` och skicka ned ett färdigt marknadsvärde i första renderingen.
- `marketStore` initieras från det serverbestämda värdet i stället för att gissa på tidszon vid modulladdning; sparad användarvald marknad har fortfarande företräde.
- Resultat: ett enda värde för frakt/pris från första paint, inga tre steg.

## Ordning

Steg 1+2, sedan 3+4, sedan 5, sist 6. Efter varje block: typkontroll och lokal verifiering av att alla omdirigeringsmål svarar 200 utan kedja.
