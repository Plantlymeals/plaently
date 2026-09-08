# Åtgärda två GitHub-audit-fynd (8 sep)

Två avgränsade säkerhetsfixar från den oberoende GitHub-auditen. Ingen funktionsförändring för besökare.

## Fix 1 — Sluta spåra `.env` i git

`.env` är incheckad i git trots att den listas i `.gitignore`. Eftersom filen redan är spårad ignorerar git `.gitignore`-raden. Innehållet är idag bara publika nycklar, men risken är att en riktig hemlighet råkar checkas in vid nästa commit.

Åtgärder:
1. Kör `git rm --cached .env` — tar bort filen ur gits index men behåller den lokalt på disk.
2. Committa borttagningen med meddelande t.ex. "Stop tracking .env (already gitignored)".
3. Verifiera att `.env` fortfarande finns på disk med oförändrat innehåll och att `git status` inte längre rapporterar den som ändrad efter en lokal redigering.

Rörs inte: `.gitignore`-innehållet, `.env`-filens faktiska innehåll, andra filer.

## Fix 2 — Validera erbjudandekoden i `starter-offer-email`

`src/routes/api/public/starter-offer-email.ts` tar emot `{ email, code }` från klienten, kontrollerar att e-postadressen finns i `newsletter_subscribers`, men validerar inte att `code` är den riktiga erbjudandekoden. Det öppnar för att vem som helst skickar valfri text som ett äkta Pläntly-mejl till en redan prenumererad adress.

Åtgärder:
1. Importera `STARTER_OFFER_CODE` från `src/lib/starterOffer.server.ts`.
2. Direkt efter att `email` och `code` har lästs ur body, och innan `newsletter_subscribers`-uppslaget, lägg till:
   - Om `code !== STARTER_OFFER_CODE`, returnera `Response.json({ error: 'Invalid code' }, { status: 400 })` och avbryt.
3. Resten av flödet (subscriber-uppslag, `sendTemplateEmail`, idempotencyKey, loggning) lämnas oförändrat.

## Tekniska detaljer

- Fil som ändras: `src/routes/api/public/starter-offer-email.ts`.
- Konstant att importera: `STARTER_OFFER_CODE = 'STARTER199'` från `src/lib/starterOffer.server.ts`.
- Git-kommando: `git rm --cached .env` följt av commit.

## Att inte göra

- Inga städändringar av oanvända shadcn/ui-filer eller npm-paket (separat prompt).
- Inga ändringar av erbjudandets affärslogik, admin-auktorisering eller språkstruktur.
