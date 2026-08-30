# Våg 3 – CTA-revision (A, B, C)

Tre riktade ändringar. Ingen layout/styling utanför det som beskrivs. Samtliga nya texter får sv + en i `src/lib/i18n.ts`.

## A) Fast mobil-CTA (sticky bottom bar)

**Ny fil:** `src/components/home/StickyMobileCta.tsx`

- `fixed bottom-0 inset-x-0 z-40 md:hidden` (döljs från md och uppåt).
- Innehåll i en rad: vänster pris "Från 33 kr/kopp" (`hero.fromPrice`, återanvänd nyckel), höger knapp.
- **Knappen pekar på Starter Pack PDP: `/product/starter-pack-12-cups-1`** — samma mål som hero-primärknappen. Knapptext: återanvänder `hero.ctaStarter` ("Handla Starter Pack").
- Synlighetslogik: `useEffect` + scroll-lyssnare, visas först när `window.scrollY > hero-höjd` (mäts via hero-sektionens `offsetHeight`, fallback 600px). Döljs även när varukorgens drawer är öppen (ingen konflikt med CartDrawer).
- Stil: `bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-3 flex items-center justify-between` + `pb-[env(safe-area-inset-bottom)]` för iPhone. Samma knappstil som headerns "Handla nu".
- Mountas i `src/components/Layout.tsx` (syns på alla sidor på mobil, inte bara startsidan). Renderas först efter hydration (`popupReady`-mönstret) så SSR påverkas noll.

## B) Riskomvänd mikrokopia vid hero- och PDP-köpknappar

**Policyverifiering (gjord):** Köpvillkoren (`Terms.tsx`, §6) ger 14 dagars ångerrätt men undantar öppnade livsmedel — därför skriver vi **"14 dagars ångerrätt"**, INTE "öppet köp". Leveranstid matchar befintliga `bundles.feat.delivered` (2–4 vardagar).

**Ny i18n-nyckel** `cta.riskReversal`:
- sv: "Leverans 2–4 vardagar · Ingen prenumeration · 14 dagars ångerrätt"
- en: "Delivery in 2–4 business days · No subscription · 14-day right of withdrawal"

**Placering 1 – Hero** (`src/components/home/HeroSection.tsx`):
Ny `<p>` direkt under knappgruppen (rad 43), ovanför `hero.fromPrice`-raden:
`<p className="text-xs text-primary-foreground/80 [text-shadow:0_1px_8px_hsl(0_0%_0%_/_0.35)]">{t("cta.riskReversal")}</p>`
(Diskretare än prisraden; ShippingBadge ligger kvar orörd längst ner.)

**Placering 2 – PDP** (`src/pages/Products.tsx`, `ProductDetail`):
Ny `<p className="text-xs text-muted-foreground">` med `cta.riskReversal` direkt under båda add-to-cart-knapparna (rad ~234 och ~295). Bara text, inga layoutändringar.

## C) Quiz – e-postgrind före resultat

**Status (verifierad i koden):** Resultatet visas direkt efter fråga 3 (`step === QUESTIONS.length + 1`) — ingen e-postgrind finns idag. Enligt din instruktion: gate:a resultatet.

**Fil:** `src/components/home/MealFinderQuiz.tsx` + `src/lib/i18n.ts`

- Efter sista frågan: beräkna rekommendationen som idag, men visa ett nytt mellansteg (nytt `step`) med e-postfält + knapp "Se mitt resultat" i stället för resultatkortet.
- Submit: validera e-post, spara till `contact_submissions`-tabellen (samma tabell som kontaktformuläret redan använder — källan markeras med `source: "quiz"` i meddelandefältet eller motsvarande befintlig kolumn, inga nya tabeller). Visar resultatet direkt efter lyckad inskick.
- Fallback: "Hoppa över"-länk under formuläret som visar resultatet utan e-post (så vi inte tappar användare som vägrar) — **eller** strikt gate utan skip. **Fråga till dig: ska e-post vara obligatorisk eller frivillig med skip-länk?** Standard i planen: frivillig med skip.
- Nya i18n-nycklar: `quiz.emailTitle` ("Ditt resultat är klart!"), `quiz.emailDesc` ("Ange din e-post så skickar vi din matchning + 10% rabatt på första köpet."), `quiz.emailPlaceholder`, `quiz.emailSubmit` ("Se mitt resultat"), `quiz.emailSkip` ("Hoppa över, visa resultatet direkt"), `quiz.emailError` — alla sv + en.
- Samtycke/GDPR: en rad liten text under fältet: "Genom att skicka godkänner du vår integritetspolicy." med länk till /integritetspolicy.

## Tekniska detaljer

- Nya i18n-nycklar: `cta.riskReversal`, `quiz.emailTitle/Desc/Placeholder/Submit/Skip/Error`.
- Inga ändringar i routing, SEO-metadata, schema eller tokens. StickyMobileCta renderas client-only → påverkar inte SSR-HTML eller PageSpeed-mätningar nämnvärt (liten komponent, kan lazy-laddas som NewsletterPopup).
- Sticky-baren kan täcka nederkant av innehåll på mobil — Footer behåller sin padding; baren är ~64px hög och ligger ovanpå, standard för sticky CTA-mönster.

## Verifiering

- Typecheck/build, sedan preview: mobil (<768px) visar sticky-bar efter hero, knappen når Starter Pack PDP; mikrokopian syns under hero-knapparna och PDP-köpknappen på båda språken; quiz-flödet: 3 frågor → e-poststeg → resultat, skip fungerar, e-post landar i admin-meddelanden. Ingen publicering förrän du godkänner.
