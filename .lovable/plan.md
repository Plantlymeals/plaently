# Rabattrutan: tangentbordsvänlig + sociala ikoner i sidfoten

Två fristående fixar. Bara två filer ändras.

## Del 1: Rabattrutan (`src/components/NewsletterPopup.tsx`)

- Rutan märks som dialogruta för skärmläsare: `role="dialog"`, `aria-modal="true"`, och `aria-labelledby` som pekar på rubriken (rubriken får `id="newsletter-popup-title"`).
- Tangentbordsfokus hålls inne i rutan: Tab och Shift+Tab går runt bland rutans egna knappar och fält.
- Escape stänger rutan och använder samma stängning som krysset.
- När rutan stängs går fokus tillbaka dit det var innan den öppnades.
- Följande ändras inte: 15-sekundersfördröjningen, formuläret och flödet för rabattkoden.

## Del 2: Sociala länkar i sidfoten (`src/components/Footer.tsx`)

- Textlänkarna LinkedIn, Instagram, TikTok och Facebook byts mot små ikoner (`h-4 w-4`) i samma färg och hover-effekt som i dag.
- LinkedIn, Instagram och Facebook tas från ikonbiblioteket som sajten redan använder. Biblioteket har ingen TikTok-ikon, så TikTok blir en enkel egen ikon i samma stil.
- Varje ikon får en `aria-label` med tjänstens namn. Adresserna, ordningen, öppning i ny flik och radens layout är oförändrade.

## Rör inte

Popupens timing och rabattlogik, sidfotens övriga kolumner, andra filer.

## Verifiering

- Diffen omfattar bara de två filerna.
- I förhandsvisningen med Playwright: öppna rabattrutan och tryck Tab många gånger. Fokus ska stanna i rutan. Escape ska stänga den, och fokus ska återställas.
- I sidfoten ska fyra ikoner synas med rätt länkar, `target="_blank"` och `aria-label`.
- `bun run check:seo` ska ge 0 fel.
