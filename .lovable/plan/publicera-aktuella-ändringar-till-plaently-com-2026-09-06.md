# Publicera aktuella ändringar till plaently.com

## Mål
Publicera det senaste bygget till `plaently.com` så att:
- Erbjudandepopupen visar uppdaterad text ("12 måltider, fyra smaker...")
- Startsidan och övrig märkning matchar den senaste kodbilden
- Säkerhetsscannern har inga kritiska fynd som blockerar publicering

## Förberedelse
- Säkerhetsscan-resultat kontrollerade: inga fynd i någon scanner (`agent_security`, `app_mcp`, `connector_security_scan`, `supabase`, `supabase_lov`, `supply_chain`).
- Inga kodändringar görs i denna plan; endast publicering av befintligt projekttillstånd.

## Åtgärd
1. Kör `preview_ui--publish` för att skicka aktuellt bygge till `plaently.com`.
2. Efter publicering, bekräfta att deploymenten är live genom att hämta startsidan och popupen en gång.

## Verifiering
- `https://plaently.com` returnerar HTTP 200.
- Erbjudandepopupen visas med korrekt svensk text efter fördröjning/avvisning.
- Ingen kritisk säkerhetsvarning blockerar publiceringen.
