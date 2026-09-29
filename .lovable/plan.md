# Tyska metadata-sidor för About, FAQ, Contact, Nutrition, Lifestyle och Privacy Policy

## Mål

Google ska kunna indexera tyska versioner av de sex sidorna med tyska titlar, beskrivningar och sociala förhandsvisningar (OG/Twitter). Det kräver riktiga tyska URL:er — bara tysk metadata på de svenska sidorna skulle ge inkonsekvent språk och kan flaggas av Google.

## Vad som byggs

Sex nya tyska sidor under `/de/`, samma mönster som de befintliga tyska produktsidorna (`/de/product/...`):

```text
/about              → /de/about
/faq                → /de/faq
/contact            → /de/contact
/nutrition          → /de/nutrition
/lifestyle          → /de/lifestyle
/integritetspolicy  → /de/datenschutz
```

Varje tysk sida får:
- Egen tysk titel och meta-beskrivning (server-renderad, så Google ser den direkt)
- Sociala förhandsvisningar på tyska: og:title, og:description, og:locale `de_DE`, twitter:title, twitter:description
- Självrefererande kanonisk URL + hreflang-alternativ (sv / en där det finns / de / x-default)
- Privacy Policy (datenschutz) behåller `noindex` precis som den svenska motsvarigheten

Sidornas innehåll återanvänder befintliga komponenter. **Observera:** brödtexten på sidorna blir kvar på svenska i detta steg — endast metadata (titlar, beskrivningar, sociala förhandsvisningar) blir tysk. Vill du ha översatt brödtext också blir det ett separat, större arbete.

## Tekniska ändringar

1. **`src/lib/staticPageHead.ts`** — utöka `buildStaticPageHead` med stöd för `lang: "de"`: og:locale `de_DE`, egen `dePath`-parameter och hreflang-länkar (sv, en om den finns, de, x-default). Befintliga svenska sidor uppdateras att peka ut sina tyska alternativ.
2. **`src/lib/i18n.ts`** — lägg till tyska SEO-texter: nya nycklar `seoDe.about/faq/contact/nutrition/lifestyle/privacy` med title + description (tysk copy skrivs i samma stil som befintliga sv/en-texter).
3. **Sex nya routefiler** — `src/routes/de.about.tsx`, `de.faq.tsx`, `de.contact.tsx`, `de.nutrition.tsx`, `de.lifestyle.tsx`, `de.datenschutz.tsx` — var och en med `head()` som anropar `buildStaticPageHead` med tyska texter, och som renderar samma sidkomponent som svenska versionen.
4. **Befintliga svenska routes** (`about.tsx`, `faq.tsx`, `contact.tsx`, `nutrition.tsx`, `lifestyle.tsx`, `integritetspolicy.tsx`) — lägg till hreflang-alternativ som pekar på de nya tyska URL:erna.
5. **`scripts/generate-sitemap.ts`** — lägg till de sex tyska URL:erna (datenschutz exkluderas om den är noindex, enligt befintlig sitemap-praxis).

## Verifiering

- Bygg utan fel; förhandsgranska varje `/de/`-sida: HTTP 200, tysk `<title>` och meta description i server-HTML, korrekt kanonisk URL, hreflang sv/de/x-default, og:locale `de_DE`.
- Bekräfta att svenska sidornas metadata är oförändrad förutom tillagda hreflang-länkar.
- Sitemap innehåller de nya tyska URL:erna.

## Publicering

Metadata når live-URL:en (och därmed Google) först vid nästa publicering. Efter publicering kan sajtkartan skickas in på nytt i Search Console för att påskynda indexering.
