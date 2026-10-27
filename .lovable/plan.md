# Search visibility review and fixes

## Where you stand today
- Google: the front page is indexed and crawled fine (last crawl 21 Oct). Last 28 days: 29 clicks and 728 impressions, a little up on the period before.
- Almost every click is people searching for "pläntly". Very few clicks come from people who don't already know the brand.
- Technical check: 8 of 9 checks pass. The one that fails (missing page language) is a false alarm. Every page sets its language correctly, so nothing changes there.
- Semrush (Swedish market): 23 keywords ranked, almost all far down the results (page 3 and lower).

## What you could realistically rank for
| Search (Sweden) | Semrush est./month | Now | Realistic target |
|---|---|---|---|
| nyttig snabbmat | ~260 | position 15 (/nyttig-snabbmat) | page 1 |
| carbonara protein / proteinpasta | small | position ~10 | top 5 |
| snabb nyttig lunch / snabb lunch recept | ~390 each | position ~50 (blog) | page 1–2 with a stronger article |
| nyttig lätt lunch | ~30 | position 27 | page 1 |
| proteinrika måltider, lunch på jobbet | small | not ranking yet | page 1 (low competition) |

Big generic searches like "lunch" or "protein" aren't realistic. Narrow searches about fast plant-based protein lunches are.

## Fixes to make
1. **/nyttig-snabbmat** (your best chance): fix the wrong "39 kr" price in the FAQ (it should be about 33 kr per meal), make the heading and intro clearly answer "nyttig snabbmat", and link to it from the front page and the products page.
2. **Blog "quick healthy lunch ideas"**: rewrite the Swedish post around "snabb nyttig lunch". Give it a clear answer near the top, a short list of ideas, and links to products. Don't make health claims, and don't use the word "vegan".
3. **Carbonara product page**: add "proteinpasta" and "carbonara med protein" wording to the title and description, keeping the existing structure.
4. **Old address `/#how-it-works`**: Google shows this address. It should simply point to the front page, so nothing needs to change unless it shows up as a separate result.
5. **AI search (ChatGPT, Perplexity, Google AI)**: check that AI crawlers are allowed. Add a short plain-language summary file (llms.txt) with what PLÄNTLY is, the prices and the main pages. Only facts already on the site.
6. Afterwards: run the SEO check (0 errors required), publish, resubmit the sitemap and ask you to request indexing for the changed pages.

## Technical details
- Edits limited to category content for /nyttig-snabbmat, the Swedish blog post (CMS row), productSeo.ts for carbonara (sv only), public/robots.txt and a new public/llms.txt.
- No changes to URLs, Shopify handles, en/de/pl pages or the html lang setup.
- Verify with check:seo, a typecheck and a live check after publishing.
