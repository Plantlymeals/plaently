# Två övervakningsfynd — ett äkta, ett inaktuellt

## Fynd 1 (äkta, hög prioritet): Shopify-nyckeln saknas i miljöfilen

Bekräftat mot koden och mot ett live-fel i förhandsvisningen just nu:

- `.env` innehåller inte längre `VITE_SHOPIFY_STOREFRONT_TOKEN`. Den föll bort i städningen runt git-spårningen.
- `src/lib/shopify.ts` kastar `"Shopify Storefront access token saknas"` så fort värdet är tomt — det slår ut produktlistor, varukorg och kassa.
- `src/lib/products.functions.ts` använder samma variabel som serverfallback vid sidrendering.
- Felet syns redan i förhandsvisningens logg.

### Åtgärd (en rad)

Lägg tillbaka raden i `.env`:

```text
VITE_SHOPIFY_STOREFRONT_TOKEN="571658d68ee29a14c1e72052f72ad77f"
```

Värdet är hämtat direkt från Shopify och är en publik storefront-nyckel (avsedd att ligga i webbläsarkoden), så det är inte en hemlighet som behöver secret-hantering. Inga andra filer ändras.

Efter ändringen: verifiera att startsidan och `/products` visar produkter utan fel, och publicera så att den riktiga sajten får samma värde.

## Fynd 2 (inaktuellt): 500-fel på grund av saknad databaskoppling

Felen loggades 09:40–10:02 i dag, under den period då `.env` inte var spårad och byggena därför saknade databasadressen. `.env` är återställd och innehåller nu både `VITE_SUPABASE_URL` och `VITE_SUPABASE_PUBLISHABLE_KEY`, och sajten är uppe igen efter akutpubliceringen. Ingen kodändring behövs — jag markerar fyndet som inaktuellt.

## Kvar sedan tidigare (oförändrat)

Shopify-webhooken `orders/fulfilled` väntar fortfarande på den nya admin-nyckeln enligt Väg A. Den frågan berörs inte av det här.
