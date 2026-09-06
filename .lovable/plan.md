# Pilot: engelska produktsidor + hreflang (5 produkter)

Fem produkter får en egen, genuint engelsk adress så vi kan mäta om EU-besökare hittar oss via sökning. Startsida, kategorisidor, blogg och resten av sajtens språkval rörs inte.

Piloten omfattar: Starter Pack (`starter-pack-12-cups-1`), Fusilli Bolognese, Pasta Carbonara, Yellow Curry & Rice, Smoky BBQ Lentils. Andra produkter får ingen engelsk adress och läggs inte i sitemap.

## Hur sidans språk skiljs från sajtens globala språkval

Detta är kärnan. Idag styrs allt synligt på produktsidan (knapptexter, brödsmulor, ingrediens- och allergentext) av det globala, sparade språkvalet `useLangStore`, som sätts först efter att sidan laddats. Det ger fel språk i det första serversvaret — alltså exakt det Google läser.

Lösningen är avgränsad till produktsidorna:

- Varje produktroute talar om sitt eget språk via route-context (`pageLocale: "sv" | "en"`), satt i `beforeLoad` — samma mekanism som redan används för besökarens marknad i `__root.tsx`. Språket kommer alltså från adressen, inte från en sparad inställning.
- I `ProductDetail` byts `const { t, lang } = useTranslation()` mot en liten lokal hjälpare, t.ex. `useLocaleTranslation(pageLocale)` i `src/lib/i18n.ts`: den slår upp samma översättningsnycklar i samma `translations`-tabell, men med det språk routen anger. Alla befintliga `t("...")`-anrop i komponenten står kvar oförändrade — bara källan till språket byts. Ingen ny översättningstabell, ingen nyckel dupliceras.
- `translateProductHtml` / `translateProductText` får `pageLocale` i stället för `lang`.
- Resultat: inget i produktsidans utdata beror på `useLangStore`, varken på `/product/$handle` eller `/en/product/$handle`. Resten av sajten (header, startsida, `AutoLanguage.tsx`) fortsätter fungera precis som idag.

## Länken till Starter Pack

`STARTER_PACK_PATH` (och den andra CTA:n längre ned) byggs av `pageLocale`: `/en/product/starter-pack-12-cups-1` på engelska sidor, `/product/starter-pack-12-cups-1` annars. Bekräftat sett: "tillbaka till produkterna" pekar även på engelska sidor mot `/products`, eftersom ingen engelsk produktlista ingår i piloten — medvetet, inte en miss.

## Övriga steg

1. **Ny route** `src/routes/en.product.$handle.tsx`, spegling av den svenska: kanonisk 301 på gamla handles, samma loader och `notFound()`-regel, `notFoundComponent`, `component: ProductDetail`. Head byggs med `getProductRouteHead(handle, "en")` och `buildProductJsonLd({ ..., locale: "en" })`.
2. **`getProductRouteHead(handle, locale = "sv")`** väljer `seo.en` vid engelska; svenska sidan oförändrad. Canonical pekar på sig själv på båda.
3. **Manuellt granskad engelsk allergen-/näringstext** i en ny liten datafil, en post per pilotprodukt. Används när `pageLocale === "en"` i stället för den regelbaserade översättningen. Saknas godkänd text visas den svenska originaltexten — aldrig en gissning. Fram tills du skriftligen godkänt de fem texterna får de engelska sidorna `noindex, follow` och läggs inte i sitemap.
4. **Hreflang**: svenska sidan pekar `sv` → sig själv, `en` → `/en/product/{handle}`, `x-default` → svenska. Engelska sidan omvänt. Byggs i `getProductRouteHead`s `links`.
5. **`buildProductJsonLd(input, locale = "sv")`**: `getProductSsrCopy(handle, locale)`, `url` och `offers.url` mot den faktiska adressen, `inLanguage` `en-GB`/`sv-SE`. `shippingDestination`, `shippingRate` och `applicableCountry` lämnas medvetet som svenska värden i piloten — det hör till det separata Shopify-marknadsspåret.
6. **Sitemap**: `scripts/generate-sitemap.ts` lägger till de fem `/en/product/...`-adresserna, först efter godkänd text.
7. **Pris/valuta**: samma marknadslogik som resten av sajten (EUR för EU). Ingen ny prislogik. De fyra smakerna visar fortsatt inget pris efter styckköps-borttagningen, så pris syns i praktiken bara på Starter Pack. `createShopifyCart`/`buyerIdentity` rörs inte.

## Rörs inte

Kategorisidor, blogg, startsida, `routeLang`, admin, de svenska produktsidornas innehåll och adresser, interna länkar från den svenska sajten, globalt språkval för övriga sajten.

## Verifiering innan commit

- Rå server-HTML (före hydrering) för `/product/starter-pack-12-cups-1`, `/en/product/starter-pack-12-cups-1` och en smaksida på båda språken: hela brödtexten, knapptexter, brödsmulor och allergentabell ska redan vara på rätt språk.
- Svenska sidan renderar identiskt med före ändringen.
- Klick på Starter Pack-CTA från engelsk smaksida stannar på `/en/...`.
- JSON-LD på engelska sidan: `url`/`offers.url` mot `/en/product/...`, `inLanguage: en-GB`.
- Korrekta hreflang-par åt båda håll, self-canonical på båda.
- Skärmbilder av engelska Starter Pack-sidan och en smaksida.
- Sidorna förblir `noindex` och utanför sitemap tills du godkänt de fem engelska texterna.
