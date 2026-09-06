# Pilot: engelska produktsidor + hreflang

Mål: ge fem produkter en egen engelsk URL så vi kan mäta om EU-besökare hittar oss via sökning. Inget på startsidan, kategorisidorna eller bloggen rörs.

## Pilotens omfattning (5 sidor)

Engelska sidor byggs bara för:

- Starter Pack (starter-pack-12-cups-1)
- Fusilli Bolognese
- Pasta Carbonara
- Yellow Curry & Rice
- Smoky BBQ Lentils

Övriga paket (Monthly Box, Office Pack, Big Office Pack, smak-boxarna) väntar tills Search Console visar utslag. En engelsk adress för en produkt utanför listan visar inget eget innehåll och tas inte med i sitemap.

## QA av den engelska långtexten (allergener/näring)

Den regelbaserade översättningen får inte ensam avgöra hur allergener presenteras.

- För de fem pilotprodukterna skrivs den engelska ingrediens-, närings- och allergentexten som fast, manuellt granskad text i koden – inte automatöversatt vid visning.
- Du (eller den som ansvarar för produktdata) läser igenom de fem engelska texterna och godkänner dem skriftligt innan sidorna läggs i sitemap.
- Tills godkännandet finns markeras de engelska sidorna som "visa men indexera inte", så de aldrig hamnar i Google med ogranskad allergentext.
- Saknas godkänd engelsk text för en produkt visas den svenska originaltexten för ingredienser/allergener i stället för en gissning.

## Så byggs det (tekniskt)

1. **Ny route** `src/routes/en.product.$handle.tsx` som återanvänder `ProductDetail` men skickar `locale: "en"` via route-context. `pageLocale` i `src/pages/Products.tsx` slutar vara hårdkodad `"sv"` och läses från routen; svenska routen skickar fortsatt `"sv"`. Samma handle-kanonisering/301 och 404-beteende som svenska routen.
2. **Koppla in befintlig engelsk copy**: `getProductRouteHead(handle, locale)` väljer `seo.en` vid `"en"`, annars oförändrat `seo.sv`. `getProductSsrCopy` har redan `locale`. `buildProductJsonLd(input, locale)` sätter `inLanguage` och `applicableCountry` efter locale.
3. **Allergendata**: en manuellt granskad engelsk text per pilotprodukt läggs i en ny liten datafil och används i stället för `translateProductText` för ingrediens-/närings-/allergenavsnittet på `/en/`-sidorna.
4. **Hreflang + canonical**: båda sidorna får `sv` → `/product/{handle}`, `en` → `/en/product/{handle}`, `x-default` → svenska URL:en. Canonical pekar på sig själv.
5. **Sitemap**: `scripts/generate-sitemap.ts` lägger till `/en/product/{handle}` för de fem pilot-handles, men först när den engelska texten är godkänd.
6. **Pris/valuta**: den engelska sidan följer samma marknadsval som resten av sajten (EUR för EU-besökare). Ingen ny prislogik. Notera: de fyra enskilda smakerna visar redan inget pris/köpknapp efter styckköps-borttagningen – det är oförändrat, så pris i praktiken bara på Starter Pack.

## Rörs inte

Kategorisidor, blogg, startsida, `routeLang`, `createShopifyCart`/`buyerIdentity`, admin, svenska produktsidornas innehåll och URL:er, interna länkar.

## Verifiering

- Hämta rå HTML för svensk och engelsk sida: rätt språk i titel/beskrivning, korrekta hreflang-par åt båda hållen, canonical på sig själv.
- JSON-LD på engelska sidan är på engelska.
- Skärmbild av `/en/product/starter-pack-12-cups-1` och en smak.
- Sitemap innehåller de nya URL:erna först efter godkänd text.
