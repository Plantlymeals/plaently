# Plan: Uppdatera produktlänkar i sidfoten

## Vad som ändras

I `src/components/Footer.tsx` (produktkolumnen i sidfoten, rad 128–131):

**Ta bort** de fyra länkarna till borttagna kopp-sidor:

- Fusilli Bolognese → /product/plant-based-fusilli-bolognese
- Pasta Carbonara → /product/plant-based-pasta-carbonara
- Smoky BBQ Lentils → /product/plant-based-smoky-bbq-lentils
- Yellow Curry & Rice → /product/plant-based-yellow-curry-rice

**Lägg till** de fyra box-länkarna (exakt som inklistrat):

- Bolognese Box → /product/bolognese-box-12-cups
- Carbonara Box → /product/carbonara-box-12-cups
- Smoky Lentils Box → /product/smoky-lentils-box-12-cups
- Yellow Curry Box → /product/yellow-curry-box-12-cups

**Behåll oförändrat:** Starter Pack, Monthly Box, Office Pack och Big Office Pack-länkarna samt allt annat i sidfoten.

## Ändras inte

- Inga ändringar av omdirigeringar för gamla kopp-sidor (lämnas som de är).
- Ingen annan sida, komponent eller metadata berörs.

## Verifiering

- Bygg/typkontroll passerar.
- Sidfoten i förhandsvisningen visar de fyra boxarna och länkarna leder till fungerande produktsidor.

## Tekniska detaljer

- En enda fil berörs: `src/components/Footer.tsx` (sex rader ut, fyra rader in, i samma länklista).
- Länkarna använder befintlig `<Link>`-struktur med label/path-poster.

Ändringen: byt ut de fyra kopp-länkarna mot de fyra box-länkarna, behåll Starter Pack/Monthly Box/Office Pack/Big Office Pack orörda, rör inga omdirigeringar. Kopp-sidorna själva försvinner inte och blir inte olänkade av det här — de nås fortfarande via produktlistan (`/products`) och startsidans smakkort, precis som idag. En enda fil, en avgränsad ändring. Du kan godkänna/skicka in den.