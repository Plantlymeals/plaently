# Hantera hemligheten SHOPIFY_REVIEW_PRICE_RULE_ID

## Bakgrund
Hemligheten `SHOPIFY_REVIEW_PRICE_RULE_ID` innehåller texten "Turkens16." — inte ett giltigt numeriskt Shopify-rabattregel-ID. Det orsakade att recensionsmejlens rabattkoder aldrig kunde skapas (Shopify svarade 404). Koden har nu en automatisk reservväg till rätt regel (`1905603477830`, "PLÄNTLY Review", 10 %), så flödet fungerar oavsett. Ingen radering har skett — begäran väntar på godkännande.

## Steg 1: Åtgärda hemligheten (välj ett)
- **Alternativ A (rekommenderas):** Skriv över värdet med rätt ID `1905603477830` via det säkra hemlighetsformuläret. Inget raderas; värdet blir korrekt.
- **Alternativ B:** Radera hemligheten helt. Koden fortsätter fungera via reservvägen, men värdet kan då inte styras centralt utan kodändring.

## Steg 2: Säkerhetsåtgärd hos användaren (utanför koden)
Eftersom "Turkens16." ser ut som ett lösenord: kontrollera om det används som lösenord någonstans (t.ex. Shopify, e-post) och byt det i så fall. Detta görs av Ahmet, inte i projektet.

## Verifiering
- Efter alternativ A: trigga process-review-requests och bekräfta att en rabattkod skapas utan att reservvägen används (loggen visar att det sparade ID:t användes).
- Ingen publicering krävs — hemligheter gäller direkt i backend.

## Tekniska detaljer
- Berörd fil: `supabase/functions/process-review-requests/index.ts` (redan uppdaterad med numerisk validering + fallback till `1905603477830` + färsk admin-token via client_credentials).
- Ingen kodändring behövs för något av alternativen.
