# Ingen kodändring – behåll nuvarande läge

## Beslut

- **Del 1 (tre /products-länkar i produktsidan):** redan genomförd och publicerad. Engelska och tyska produktsidor länkar till `/en/products` respektive `/de/products`.
- **Del 2 (Hem → /en och /de):** genomförs inte. Det finns ingen engelsk eller tysk startsida, så länkarna gav 26 brutna länkar (404). Hem/Home/Startseite går fortsatt till `/` på alla språk.

## Åtgärd

- Inga filer ändras.
- Kör `bun run check:seo` en gång till som kontroll: förväntat 0 fel och bara de tre kända paketvarningarna.

## Senare (valfritt)

Om riktiga startsidor på `/en` och `/de` byggs kan Hem-länken peka dit. Det blir i så fall ett eget uppdrag.
