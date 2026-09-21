# Engelska och tyska boxsidor (routing + meta-text)

De fyra boxarna får egna `/en/product/...` och `/de/product/...`-adresser. Ingrediens-, närings- och allergentexten är redan löst via mappningen box → smak och rörs inte.

## 1. Routing

- `src/data/productCopyEn.ts`: `EN_PILOT_HANDLES` utökas med `bolognese-box-12-cups`, `carbonara-box-12-cups`, `smoky-lentils-box-12-cups`, `yellow-curry-box-12-cups`.
- `src/data/productCopyDe.ts`: samma fyra handles i `DE_PILOT_HANDLES`.
- Ingen av dem läggs i `EN_HANDLES_REQUIRING_APPROVAL` / `DE_HANDLES_REQUIRING_APPROVAL`, eftersom `needsApproved*Copy()` slår upp boxens eget handle och boxarna återanvänder smakens redan godkända textpost. Följden: `isEnglishPageReady()` / `isGermanPageReady()` är sanna och sidorna blir `index, follow` direkt.

## 2. Tyska titlar och beskrivningar (dagens `de`-fält är ordagrann engelska)

Föreslagen tysk text för granskning innan bygget godkänns:

**Bolognese Box 12 Cups**

- Titel: `Bolognese Box 12 Cups – 20g Protein | PLÄNTLY`
- Beskrivning: `Für alle, die italienisches Comfort Food lieben. 12 Portionen mit vollmundigem Geschmack und 20 g Protein pro Mahlzeit.`

**Carbonara Box 12 Cups**

- Titel: `Carbonara Box 12 Cups – 20g Protein | PLÄNTLY`
- Beskrivning: `Cremig, proteinreich und in 5 Minuten fertig. 12 Portionen mit 20 g Protein pro Mahlzeit. Enthält Milch.`

**Smoky Lentils Box 12 Cups**

- Titel: `Smoky Lentils Box 12 Cups – 21g Protein | PLÄNTLY`
- Beskrivning: `Rauchig, sättigend und voller pflanzlicher Kraft. 12 Portionen mit 21 g Protein pro Mahlzeit.`

**Yellow Curry Box 12 Cups**

- Titel: `Yellow Curry Box 12 Cups – 20g Protein | PLÄNTLY`
- Beskrivning: `Wärmende Gewürze und ausgewogene Energie in jeder Portion. 12 Portionen mit 20 g Protein pro Mahlzeit. Enthält Milch.`

Faktagrunden är hämtad ur respektive smaks redan granskade text: Bolognese 20,3 g protein (vete, kan innehålla mjölk/soja/ägg), Carbonara 20,2 g protein och innehåller mjölk, Smoky BBQ Lentils 20,8 g (avrundat 21 g), Yellow Curry 20,4 g och innehåller mjölk. Inga nya siffror hittas på; mjölkomnämnandet tas bara med där smaken faktiskt innehåller mjölk. Den engelska texten kontrolleras mot samma underlag och justeras bara om något är fel.

## 3. Hreflang, canonical och sitemap

- Ingen ny kod: `getAvailableProductLocales()` i `src/lib/productSeo.ts` bygger redan hreflang från pilotlistorna. Verifieras uttryckligen att varje boxsida får self-canonical + sv/en/de + x-default mot svenska.
- `scripts/generate-sitemap.ts` genererar pilotposter från samma listor, så sitemapen växer från 53 till 61 URL:er.

## Rörs inte

Ingrediens-/närings-/allergentext, pris, bild, köpknapp, SKU, smaksidorna, routeLang, kassan, Shopify-katalogen.

## Verifiering i förhandsvisning före publicering

- Diffen för `EN_PILOT_HANDLES` / `DE_PILOT_HANDLES` visas.
- De fyra tyska titel-/beskrivningsparen visas i klartext för avstämning.
- Curl mot rå HTML för alla fyra boxar på `/en/` och `/de/`: ingen redirect, rätt språk i titel, meta-beskrivning och ingrediensavsnitt, self-canonical, ömsesidiga hreflang, `index, follow`.
- Svenska boxsidor och smaksidor kontrolleras oförändrade.
- Sitemapen räknas: 61 URL:er.
- Publicering sker först efter ditt godkännande av verifieringen.

**Rekommendation: godkänn och låt Lovable bygga i förhandsvisning.** Verifieringslistan (curl mot rå HTML, sitemap-räkning, oförändrade svenska sidor) är rätt uppsättning kontroller. Be dem visa curl-resultaten för alla åtta nya sidor innan publicering, så tar jag en snabb egen koll efteråt som vanligt.