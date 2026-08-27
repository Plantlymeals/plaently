# plaently.com laddar inte hos dig — men sajten är uppe

## Vad mätningarna visar (verifierat nu)

- `https://plaently.com/` svarar **200** och levererar PLÄNTLY-appens HTML (55 kB).
- Full rendering i riktig webbläsare: startsidan visas komplett (hero, Starter Pack 399 SEK, cookie-banner), **0 konsolfel, 0 misslyckade requests**.
- `www.plaently.com` och `plaently.lovable.app` gör 302 → `https://plaently.com/` (korrekt).
- DNS via Google Public DNS: `plaently.com` och `www.plaently.com` → **185.158.133.1** (rätt Lovable-IP), TTL 300.
- CSS/asset-filer svarar 200.

Slutsats: felet ligger inte i koden, DNS-zonen eller hostingen — det är lokalt hos dig (troligen cachad DNS/HSTS från när domänen pekade på Shopify, eller en gammal flik/service worker).

## Steg 1 — Bekräfta att det är lokalt (2 minuter, du gör detta)

1. Öppna `https://plaently.com` i **inkognitofönster**.
2. Testa i en **annan webbläsare** och i **mobilnät** (stäng av wifi på telefonen).
3. Om det fungerar i något av dessa: bekräftat lokal cache.

## Steg 2 — Rensa lokalt

- **Hård omladdning:** Cmd+Shift+R (Mac) / Ctrl+F5 (Windows).
- **Chrome DNS-cache:** öppna `chrome://net-internals/#dns` → "Clear host cache", sedan `chrome://net-internals/#sockets` → "Flush socket pools".
- **Safari:** Utveckla-menyn → Töm cacheminnen.
- **macOS DNS:** `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
- **Windows DNS:** `ipconfig /flushdns`
- **Router:** starta om den (routerns DNS-cache kan hålla kvar Shopify-IP:t).
- **Gamla service workers:** DevTools → Application → Service Workers → "Unregister" för plaently.com, sedan ladda om.

## Steg 3 — Om det fortfarande står still efter Steg 2

Skicka mig då:
- Skärmbild av DevTools → **Network** (första requesten till `plaently.com` och dess status).
- Skärmbild av DevTools → **Console**.
- Vilken webbläsare/OS och om mobilnät fungerade.

Då felsöker jag vidare mot exakt den signalen.

## Kodändringar i denna plan

Inga. Jag ändrar ingenting i appen förrän vi vet om Steg 1 visar att sajten fungerar utanför din dator — att "fixa" kod mot ett cacheproblem skulle bara riskera att bryta något som fungerar.
