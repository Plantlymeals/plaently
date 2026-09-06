# Sluta sälja enskilda koppar — visa bara smakerna

De fyra smakerna visas precis som idag (bild, namn, pris, näring), men köpknappen för en enskild kopp byts mot en knapp som leder till Starter Pack. Paketen påverkas inte. Inget ändras i Shopify.

## Vad som ändras

1. **Produktlistan `/products`** — alla kort i gridden är redan enbart enskilda koppar, så knappen "Lägg i varukorgen" byts mot "Prova i Starter Pack" på samtliga kort. Pris och sparbadge lämnas orörda.

2. **Produktsidan `/product/:handle`** — samma komponent visar både koppar och paket. Vi villkorar med `isListableProduct(product.title)`:
   - Sant (enskild kopp) → båda köpknapparna (den övre och den i CTA-blocket längst ner) ersätts av en länkknapp till `/product/starter-pack-12-cups-1`, med samma storlek/stil som idag.
   - Falskt (paket) → knappen och `handleAddToCart` lämnas exakt som idag.

3. **Startsidans smaksektion (`ProductOverview`)** — samma knappbyte. Dessutom hämtas fler produkter (20) och filtreras med `isListableProduct`, varefter de fyra första visas, så sektionen garanterat visar smakerna och aldrig ett paket.

4. **Ny text i språkfilen**: `products.tryInStarterPack` — sv: "Prova i Starter Pack", en: "Try it in the Starter Pack".

## Rörs inte

`BundleSection.tsx` (bara paket) och `MealFinderQuiz.tsx` (rekommenderar alltid ett paket) fungerar oförändrat. 199 kr-kampanjen/STARTER199, frakt, marknads- och språkval, adminpanelen och Shopify-katalogen lämnas orörda.

## Teknisk detalj

`isListableProduct` från `src/lib/productFilters.ts` är enda källan för vad som räknas som enskild kopp — ingen ny parallell lista skapas. I `Products.tsx` är funktionen redan importerad, så ingen namnkrock uppstår när `ProductDetail` använder den. Knappen renderas som `asChild` runt en `Link`, `handleAdd`/`handleAddToCart` anropas inte längre för koppar.

## Verifiering

Skärmdumpar av produktlistan, en smaksida (Carbonara), startsidans smaksektion samt Starter Pack-sidan där "Lägg i varukorgen" fortfarande fungerar.
