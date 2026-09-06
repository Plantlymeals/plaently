import { canonicalizeHandle } from "@/lib/productSeo";

/**
 * English product pilot.
 *
 * Only these five products get an English URL (`/en/product/{handle}`).
 * Every other handle redirects to the Swedish page.
 */
export const EN_PILOT_HANDLES = [
  "starter-pack-12-cups-1",
  "plant-based-fusilli-bolognese",
  "plant-based-pasta-carbonara",
  "plant-based-yellow-curry-rice",
  "plant-based-smoky-bbq-lentils",
] as const;

export function isEnglishPilotHandle(handle: string): boolean {
  return (EN_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

/**
 * Manually reviewed English ingredient / nutrition / allergen copy.
 *
 * SAFETY RULE: allergen and nutrition text must never come from the
 * rule-based auto-translation. An entry is only used when it has been read and
 * approved by whoever owns the product data (`approved: true`). Until then the
 * English page renders the original Swedish source text — never a guess — and
 * the page stays `noindex` and out of the sitemap.
 *
 * To publish an English long description: add the handle below with reviewed
 * HTML and set `approved: true`.
 */
export type ApprovedEnCopy = { approved: boolean; html: string };

export const EN_PRODUCT_COPY: Record<string, ApprovedEnCopy> = {
  "plant-based-fusilli-bolognese": {
    approved: true,
    html: `<p>Not just tomato, this is a sun-drenched taste experience! Our secret? A generous dose of red bell peppers for depth and complexity, and a splash of extra virgin olive oil that brings in a smooth, fruity finish. Join us on our plant-based journey to the heart of Italy.</p>
<h3>Nutrition</h3>
<table>
<thead><tr><th>Nutrient</th><th>Per cup (75 g)</th><th>Per 100 g, dry content</th></tr></thead>
<tbody>
<tr><td>Energy</td><td>263 kcal / 1109 kJ</td><td>350 kcal / 1479 kJ</td></tr>
<tr><td>Fat</td><td>2.2 g</td><td>2.9 g</td></tr>
<tr><td>of which saturates</td><td>0.4 g</td><td>0.5 g</td></tr>
<tr><td>Carbohydrate</td><td>37.5 g</td><td>50 g</td></tr>
<tr><td>of which sugars</td><td>7.1 g</td><td>9.4 g</td></tr>
<tr><td>Fibre</td><td>5.9 g</td><td>7.8 g</td></tr>
<tr><td>Protein</td><td>20.3 g</td><td>27 g</td></tr>
<tr><td>Salt</td><td>2.4 g</td><td>3.2 g</td></tr>
</tbody>
</table>
<h3>Ingredients</h3>
<p>Pasta (durum <strong>wheat</strong> semolina, pea protein isolate 52%), tomato, potato starch, onion, sugar, salt, carrot, garlic, red bell pepper, herbs and spices and extra virgin olive oil.</p>
<h3>Allergens</h3>
<p><strong>Contains:</strong> Wheat.</p>
<p><strong>May contain:</strong> Milk, soy and egg.</p>
<h3>Preparation</h3>
<p>Shake the closed cup. Remove the lid, add the recommended amount of boiling water — approximately 190 ml — and stir well with a fork. Wait 5 minutes, stir again and enjoy!</p>
<p>Net weight: 75 g · Shelf life: 12 months</p>`,
  },
  "plant-based-pasta-carbonara": {
    approved: true,
    html: `<p>Not just cheese and cream, plant-based protein with creamy pasta! Our secret? An ingenious play of pea textures and a spicy dose of black pepper and garlic that stirs in the classic Italian spirit. Join us on our plant-based journey to the heart of Rome — where Carbonara meets the future.</p>
<h3>Nutrition</h3>
<table>
<thead><tr><th>Nutrient</th><th>Per cup (75 g)</th><th>Per 100 g, dry content</th></tr></thead>
<tbody>
<tr><td>Energy</td><td>285 kcal / 1202 kJ</td><td>380 kcal / 1602 kJ</td></tr>
<tr><td>Fat</td><td>6.4 g</td><td>8.5 g</td></tr>
<tr><td>of which saturates</td><td>0.6 g</td><td>0.8 g</td></tr>
<tr><td>Carbohydrate</td><td>34.5 g</td><td>46 g</td></tr>
<tr><td>of which sugars</td><td>5.0 g</td><td>6.6 g</td></tr>
<tr><td>Fibre</td><td>4.3 g</td><td>5.8 g</td></tr>
<tr><td>Protein</td><td>20.2 g</td><td>27 g</td></tr>
<tr><td>Salt</td><td>2.9 g</td><td>3.9 g</td></tr>
</tbody>
</table>
<h3>Ingredients</h3>
<p>Pasta (durum <strong>wheat</strong> semolina, pea protein isolate 52%), pea protein 21%, whey powder (contains <strong>milk</strong>), potato starch, sunflower oil in powder (non-hydrogenated high-oleic sunflower oil, glucose syrup, <strong>milk</strong> protein), processed cheese powder (contains <strong>milk</strong>), flavourings (contain <strong>milk</strong>), salt, black pepper, garlic, turmeric.</p>
<h3>Allergens</h3>
<p><strong>Contains:</strong> Wheat and milk.</p>
<p><strong>May contain:</strong> Soy and egg.</p>
<h3>Preparation</h3>
<p>Shake the closed cup. Remove the lid, add the recommended amount of boiling water — approximately 170 ml — and stir well with a fork. Wait 5 minutes, stir again and enjoy!</p>
<p>Net weight: 75 g · Shelf life: 12 months</p>`,
  },
  "plant-based-yellow-curry-rice": {
    approved: true,
    html: `<p>A creamy explosion of sun-warmed flavors! Our plant-based curry is built with textured sunflower protein and a smooth coconut milk sauce that perfectly balances curry and coriander. Served with rice — a full, exotic meal that's ready in minutes. A journey to Southeast Asian street food, captured in a cup.</p>
<h3>Nutrition</h3>
<table>
<thead><tr><th>Nutrient</th><th>Per cup (75 g)</th><th>Per 100 g, dry content</th></tr></thead>
<tbody>
<tr><td>Energy</td><td>285 kcal / 1195 kJ</td><td>391 kcal / 1648 kJ</td></tr>
<tr><td>Fat</td><td>6.7 g</td><td>9.2 g</td></tr>
<tr><td>of which saturates</td><td>3.8 g</td><td>5.2 g</td></tr>
<tr><td>Carbohydrate</td><td>32.9 g</td><td>45 g</td></tr>
<tr><td>of which sugars</td><td>6.5 g</td><td>8.9 g</td></tr>
<tr><td>Fibre</td><td>6.1 g</td><td>8.3 g</td></tr>
<tr><td>Protein</td><td>20.4 g</td><td>28 g</td></tr>
<tr><td>Salt</td><td>2.3 g</td><td>3.1 g</td></tr>
</tbody>
</table>
<h3>Ingredients</h3>
<p>Sunflower protein 38.4%, precooked rice 27.4%, potato starch, coconut milk (coconut milk, maltodextrin, sodium caseinate (contains <strong>milk</strong>)), <strong>milk</strong> protein, creamer (glucose syrup, vegetable fat, <strong>milk</strong> protein, stabilizer: E340, anticaking agent: E551, emulsifier: E471), dextrose, salt, cane sugar, natural flavourings, curry powder, lime juice concentrate powder (maltodextrin), carrot, onion, herbs, spices and coriander.</p>
<h3>Allergens</h3>
<p><strong>Contains:</strong> Milk.</p>
<p><strong>May contain:</strong> Wheat, soy and egg.</p>
<h3>Preparation</h3>
<p>Shake the closed cup. Remove the lid, add the recommended amount of boiling water — approximately 180 ml — and stir well with a fork. Wait 5 minutes, stir again and enjoy!</p>
<p>Net weight: 73 g · Shelf life: 12 months</p>`,
  },
  "plant-based-smoky-bbq-lentils": {
    approved: true,
    html: `<p>Smoky BBQ with green lentils, now captured in a warm cup! Our dish is built on a generous base of textured sunflower protein and green lentils with the sweetness of smoked paprika, caramelized onions and the spicy flavor of garlic. It's the BBQ tribute for those who love flavorful meals.</p>
<h3>Nutrition</h3>
<table>
<thead><tr><th>Nutrient</th><th>Per cup (65 g)</th><th>Per 100 g, dry content</th></tr></thead>
<tbody>
<tr><td>Energy</td><td>228 kcal / 954 kJ</td><td>351 kcal / 1481 kJ</td></tr>
<tr><td>Fat</td><td>2.9 g</td><td>4.5 g</td></tr>
<tr><td>of which saturates</td><td>0.4 g</td><td>0.6 g</td></tr>
<tr><td>Carbohydrate</td><td>25.4 g</td><td>39 g</td></tr>
<tr><td>of which sugars</td><td>9.1 g</td><td>14 g</td></tr>
<tr><td>Fibre</td><td>9.1 g</td><td>14 g</td></tr>
<tr><td>Protein</td><td>20.8 g</td><td>32 g</td></tr>
<tr><td>Salt</td><td>2.0 g</td><td>3.1 g</td></tr>
</tbody>
</table>
<h3>Ingredients</h3>
<p>Sunflower protein 38.5%, precooked green lentils 30.8%, tomato powder, cane sugar, potato starch, red bell pepper, flavourings, salt, onion, yeast, carrot, caramelised sugar powder (caramelised sugar, maltodextrin), herbs and spices, sodium diacetate, garlic.</p>
<h3>Allergens</h3>
<p><strong>Contains:</strong> None (allergen-free).</p>
<p><strong>May contain:</strong> Wheat, milk, soy and egg.</p>
<h3>Preparation</h3>
<p>Shake the closed cup. Remove the lid, add the recommended amount of boiling water — approximately 180 ml — and stir well with a fork. Wait 5 minutes, stir again and enjoy!</p>
<p>Net weight: 65 g · Shelf life: 12 months</p>`,
  },
};

export function getApprovedEnCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = EN_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

/** True once the English long text for this product has been reviewed. */
export function hasApprovedEnCopy(handle: string | undefined): boolean {
  return getApprovedEnCopy(handle) !== null;
}
