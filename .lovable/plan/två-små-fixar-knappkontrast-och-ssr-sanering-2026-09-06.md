# Två små fixar: knappkontrast och SSR-sanering

Två oberoende ändringar. Inget rör Shopify, STARTER199, frakt eller språkval.

## 1. Mörkare grönt på knappar (läsbarhet)

Dagens gröna knappfärg med vit text ger för svag kontrast för tillgänglighetskravet. Samma nyans behålls, bara några steg mörkare, vilket klarar kravet med marginal.

I `src/styles.css` byts `hsl(100 48% 45%)` mot `hsl(100 48% 33%)` på alla nio ställen som använder värdet:
- rad 99 `--primary`, rad 116 `--ring`, rad 130 `--sidebar-primary`, rad 135 `--sidebar-ring`
- rad 120–122 gradienterna och rad 124/126 skuggorna, som har färgen inskriven direkt

Ljusgröna `--secondary`/`--accent` rörs inte.

Efter ändringen tas en skärmbild av en köp-knapp så du kan se att grönt fortfarande känns som varumärkets grönt.

## 2. Säkrare textrensning på servern

`src/lib/sanitizeHtml.ts` har ett skyddsnät som körs när sidor renderas på servern. Det missar i dag en variant av skadlig kod där ett snedstreck står före attributet istället för mellanslag.

Regeln ändras till:

```text
/(?<=[\s/])on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
```

Separatortecknet konsumeras inte längre av matchningen, så bara själva attributet tas bort.

Verifieras direkt med ett engångsskript mot fyra fall: `<img/onerror=...>`, `<svg/onload=...>`, det gamla fallet med mellanslag, samt vanlig text med ord som "onsdag"/"bacon" som inte får påverkas. Resultatet visas i chatten tillsammans med diffen innan något publiceras.

## Rörs inte

Shopify, rabattkoden, frakt, marknads- och språkdetektering, samt DOMPurify-saneringen i webbläsaren.
