# Rätta språk- och produktmetadata

## Ändringar
- Gör svenska till global `x-default` för samtliga SV/EN-par och låt `html lang` samt `og:locale` följa sidans faktiska språk.
- Behåll exakt tre hreflang-taggar per sida och ta bort överlappande metadatahantering som kan skapa dubbletter.
- Reparera de tre paketprodukternas detaljsidor genom att använda samma robusta produktupplösning som Starter Pack och lägga till lokaliserade SEO-reservvärden när Shopify-data är tom.
- Synka språkvalet med språk-URL:en på startsidan och policysidorna så title, description, H1 och innehåll aldrig blandas.
- Normalisera fristående engelskt “and” till “och” i svensk produkttext och kontrollera de fyra angivna boxprodukterna.

## Avgränsning
- Ändra inte innehåll eller URL-par för blogginlägg, de fyra enskilda smaksidorna, policysidornas befintliga SV/EN-kopplingar eller de verifierade kategori-paren.
- Shopify Admin är inte anslutet just nu, så korrigeringen görs i storefrontens visnings- och reservlogik utan att skriva till Shopify.

## Verifiering
- Kontrollera SSR-HTML och färdigrenderad DOM för startsidan, båda policysidorna samt alla fyra paket-URL:erna.
- Bekräfta unik title/description/canonical, tre hreflang-rader, svensk `x-default`, korrekt `html lang`/`og:locale` och svenska produktbeskrivningar.
