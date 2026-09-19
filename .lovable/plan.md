# Fix: "per måltid"-etiketten bredvid boxpris

## Bakgrund
På produktsidor visas "per måltid" bredvid priset när produkten inte matchar sparlogiken (SavingsBadge). Det stämmer inte — 399 kr är priset för hela boxen (12 koppar), inte per måltid. Drabbar de fyra smakboxarna (Bolognese, Carbonara, Smoky Lentils, Yellow Curry) och i princip alla produkter utan sparbadges.

## Beslut (användaren har valt)
Visa pris per måltid: t.ex. "33 kr per måltid" (399 kr / 12 koppar ≈ 33 kr) — konsekvent med startsidans "Från 33 kr/kopp".

## Ändringar

### 1. src/lib/bundleSavings.ts
- Lägg till en ny exporterad funktion `getPerMealInfo(title, price)` som räknar ut antal måltider och pris per måltid för boxar.
- Mappning: bolognese, carbonara, smoky lentils, yellow curry → 12 koppar (samma ordningsprincip som BUNDLE_MEAL_COUNTS — längre nycklar först).
- Returnerar `{ mealCount, perMeal: Math.round(price / mealCount) }` eller null när ingen matchning finns.
- BUNDLE_MEAL_COUNTS och getBundleSavings ändras INTE — sparbadges för Starter Pack/Monthly/Office påverkas inte.

### 2. src/pages/Products.tsx (prisraden, ~rad 290)
- I fallback-grenen (ingen SavingsBadge): anropa `getPerMealInfo`.
  - Matchning: visa `{perMeal} kr {t("products.perMeal")}` → "33 kr per måltid" (sv), "33 kr per meal" (en), "33 kr pro Mahlzeit" (de) via befintliga i18n-nycklar.
  - Ingen matchning: visa ingen etikett alls (den gamla texten var missvisande i alla fall).
- Övrigt på raden (pris, sparbadge, valuta) orörts.

## Omfattning
- Endast frontend-presentation på produktsidans prisrad. Inga prisändringar, ingen Shopify-logik, inga rutter, ingen SEO-metadata.

## Verifiering
1. Förhandsvisning: alla fyra boxsidor visar "33 kr per måltid" bredvid 399 kr.
2. Starter Pack och Monthly Box visar fortfarande sparbadgen (orörd väg).
3. Koppsidor (enskilda smaker) visar fortfarande Starter Pack-knapp utan prisrad.
4. Inga konsollfel i förhandsvisningen.

## Publicering
Publiceras först efter användarens godkännande av verifieringen.
