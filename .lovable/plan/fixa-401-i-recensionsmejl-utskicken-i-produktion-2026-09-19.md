# Fixa 401 i recensionsmejl-utskicken i produktion

## Bakgrund

Nyckelkontrollen i utskicksrutten för recensionsmejl är redan åtgärdad i koden: rutten accepterar både miljövärdet och nyckeln ur databasens nyckelvalv (samma källa som det schemalagda kvartsjobbet använder). Ändringen är bara publicerad på förhandsvisningen — den riktiga sajten kör fortfarande den gamla versionen som avvisar jobbet med 401.

## Åtgärder

1. Verifiera att produktion fortfarande svarar 401 med nyckelvalvets hemlighet (bekräftar att felet ligger i opublicerad kod).
2. Publicera sajten så den rättade nyckelkontrollen gäller på https://plaently.lovable.app.
3. Verifiera end-to-end i produktion:
   - Skicka ett signerat testanrop med det schemalagda jobbets nyckel direkt mot den publicerade utskicksrutten och bekräfta 200 (inte 401).
   - Lägg en testbeställning i kön, kör utskicket, bekräfta att mejlet skickas till ahmet@plaently.com med en giltig 10 %-rabattkod.
   - Rensa testbeställningen och testraden efteråt; låt rabattkoden ligga kvar för test i kassan.
4. Bekräfta att kvartsjobbet (var 15:e minut) nu når fram — inga fler 401 i loggarna.

## Tekniska detaljer

- Fil: `src/routes/api/public/review-request-emails.ts` (ingen kodändring behövs — kontrollen på rad 67–79 accepterar redan valv-hemligheten som fallback).
- Cron-jobbet anropar `https://plaenty.lovable.app/api/public/review-request-emails` med headern `x-internal-secret`.
- Ingen ändring av STARTER199, admin-autentisering eller routeLang-strukturen.
