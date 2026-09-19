# Skriv över SHOPIFY_REVIEW_PRICE_RULE_ID med rätt rabattregel-ID

## Mål
Ersätt det felaktiga värdet ("Turkens16.") i hemligheten `SHOPIFY_REVIEW_PRICE_RULE_ID` med rätt Shopify-rabattregel-ID `1905603477830` (rabattregeln "PLÄNTLY Review", 10 %).

## Steg
1. Öppna det säkra formuläret för `SHOPIFY_REVIEW_PRICE_RULE_ID` via update_secret (värdet skrivs in direkt i formuläret, inte i chatten).
2. Verifiera efteråt att recensionsmejl-flödet fortfarande fungerar (testbeställning → schemalagt mejl → giltig rabattkod), så att ändringen inte påverkar något.

## Påverkan
- Ingen kodändring, ingen publicering behövs.
- Funktionen ändras inte praktiskt — koden använder redan automatiskt samma regel-ID som reservväg — men det lagrade värdet blir korrekt och reservvägen behövs inte längre.
- Det gamla felaktiga värdet ("Turkens16.") finns kvar någonstans: om det är ett lösenord du använder någon annanstans bör du byta det där.
