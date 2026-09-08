import { canonicalizeHandle } from "@/lib/productSeo";
import { hasApprovedEnCopy } from "@/data/productCopyEn";

/**
 * German product pilot.
 *
 * Only these five products get a German URL (`/de/product/{handle}`).
 * Every other handle redirects to the Swedish page.
 */
export const DE_PILOT_HANDLES = [
  "starter-pack-12-cups-1",
  "plant-based-fusilli-bolognese",
  "plant-based-pasta-carbonara",
  "plant-based-yellow-curry-rice",
  "plant-based-smoky-bbq-lentils",
] as const;

export function isGermanPilotHandle(handle: string): boolean {
  return (DE_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

/**
 * AI-generated German ingredient / nutrition / allergen copy.
 *
 * SAFETY RULE: allergen and nutrition text must never come from the
 * rule-based auto-translation. An entry is only used when it has been read and
 * approved by whoever owns the product data (`approved: true`). Until then the
 * German page renders the original Swedish source text — never a guess — and
 * the page stays `noindex` and out of the sitemap.
 *
 * To publish a German long description: add the handle below with reviewed
 * HTML and set `approved: true`.
 */
export type ApprovedDeCopy = { approved: boolean; html: string };

export const DE_PRODUCT_COPY: Record<string, ApprovedDeCopy> = {
  "plant-based-fusilli-bolognese": {
    approved: false,
    html: `<p>Nicht einfach nur Tomate — ein sonnenverwöhntes Geschmackserlebnis! Unser Geheimnis? Eine großzügige Portion roter Paprika für Tiefe und Komplexität sowie ein Schuss natives Olivenöl extra für einen sanften, fruchtigen Abgang. Begleite uns auf unserer pflanzlichen Reise ins Herz Italiens.</p>
<h3>Nährwerte</h3>
<table>
<thead><tr><th>Nährwert</th><th>Pro Becher (75 g)</th><th>Pro 100 g, Trockenmasse</th></tr></thead>
<tbody>
<tr><td>Energie</td><td>263 kcal / 1109 kJ</td><td>350 kcal / 1479 kJ</td></tr>
<tr><td>Fett</td><td>2,2 g</td><td>2,9 g</td></tr>
<tr><td>davon gesättigte Fettsäuren</td><td>0,4 g</td><td>0,5 g</td></tr>
<tr><td>Kohlenhydrate</td><td>37,5 g</td><td>50 g</td></tr>
<tr><td>davon Zucker</td><td>7,1 g</td><td>9,4 g</td></tr>
<tr><td>Ballaststoffe</td><td>5,9 g</td><td>7,8 g</td></tr>
<tr><td>Eiweiß</td><td>20,3 g</td><td>27 g</td></tr>
<tr><td>Salz</td><td>2,4 g</td><td>3,2 g</td></tr>
</tbody>
</table>
<h3>Zutaten</h3>
<p>Pasta (Hart<strong>weizen</strong>grieß, Erbsenproteinisolat) 52%, texturierte Erbsenproteine 21%, Tomate, Kartoffelstärke, Aroma, Zwiebel, Zucker, Salz, Karotte, Knoblauch, rote Paprika, Kräuter und Gewürze, natives Olivenöl extra.</p>
<h3>Allergene</h3>
<p><strong>Enthält:</strong> Weizen.</p>
<p><strong>Kann Spuren enthalten von:</strong> Milch, Soja und Ei.</p>
<h3>Zubereitung</h3>
<p>Den geschlossenen Becher schütteln. Deckel entfernen, die empfohlene Menge kochendes Wasser hinzufügen — etwa 190 ml — und gut mit einer Gabel umrühren. 5 Minuten warten, erneut umrühren und genießen!</p>
<p>Nettogewicht: 75 g · Mindesthaltbarkeit: 12 Monate</p>`,
  },
  "plant-based-pasta-carbonara": {
    approved: false,
    html: `<p>Nicht einfach nur Käse und Sahne — pflanzliches Protein trifft auf cremige Pasta! Unser Geheimnis? Ein raffiniertes Spiel aus Erbsen-Texturen und eine würzige Dosis schwarzer Pfeffer und Knoblauch, die den klassischen italienischen Geist einfängt. Begleite uns auf unserer pflanzlichen Reise ins Herz Roms — wo Carbonara auf die Zukunft trifft.</p>
<h3>Nährwerte</h3>
<table>
<thead><tr><th>Nährwert</th><th>Pro Becher (75 g)</th><th>Pro 100 g, Trockenmasse</th></tr></thead>
<tbody>
<tr><td>Energie</td><td>285 kcal / 1202 kJ</td><td>380 kcal / 1602 kJ</td></tr>
<tr><td>Fett</td><td>6,4 g</td><td>8,5 g</td></tr>
<tr><td>davon gesättigte Fettsäuren</td><td>0,6 g</td><td>0,8 g</td></tr>
<tr><td>Kohlenhydrate</td><td>34,5 g</td><td>46 g</td></tr>
<tr><td>davon Zucker</td><td>5,0 g</td><td>6,6 g</td></tr>
<tr><td>Ballaststoffe</td><td>4,3 g</td><td>5,8 g</td></tr>
<tr><td>Eiweiß</td><td>20,2 g</td><td>27 g</td></tr>
<tr><td>Salz</td><td>2,9 g</td><td>3,9 g</td></tr>
</tbody>
</table>
<h3>Zutaten</h3>
<p>Pasta (Hart<strong>weizen</strong>grieß, Erbsenproteinisolat 52%), Erbsenprotein 21%, Molkenpulver (enthält <strong>Milch</strong>), Kartoffelstärke, Sonnenblumenöl-Pulver (nicht gehärtetes High-Oleic-Sonnenblumenöl, Glukosesirup, <strong>Milch</strong>protein), Schmelzkäsepulver (enthält <strong>Milch</strong>), Aromen (enthalten <strong>Milch</strong>), Salz, schwarzer Pfeffer, Knoblauch, Kurkuma.</p>
<h3>Allergene</h3>
<p><strong>Enthält:</strong> Weizen und Milch.</p>
<p><strong>Kann Spuren enthalten von:</strong> Soja und Ei.</p>
<h3>Zubereitung</h3>
<p>Den geschlossenen Becher schütteln. Deckel entfernen, die empfohlene Menge kochendes Wasser hinzufügen — etwa 170 ml — und gut mit einer Gabel umrühren. 5 Minuten warten, erneut umrühren und genießen!</p>
<p>Nettogewicht: 75 g · Mindesthaltbarkeit: 12 Monate</p>`,
  },
  "plant-based-yellow-curry-rice": {
    approved: false,
    html: `<p>Eine cremige Explosion sonnenwarmer Aromen! Unser pflanzliches Curry basiert auf strukturiertem Sonnenblumenprotein und einer sanften Kokosmilchsauce, die Curry und Koriander perfekt ausbalanciert. Serviert mit Reis — eine vollständige, exotische Mahlzeit, die in Minuten fertig ist. Eine Reise zum südostasiatischen Street Food, eingefangen in einem Becher.</p>
<h3>Nährwerte</h3>
<table>
<thead><tr><th>Nährwert</th><th>Pro Becher (73 g)</th><th>Pro 100 g, Trockenmasse</th></tr></thead>
<tbody>
<tr><td>Energie</td><td>285 kcal / 1195 kJ</td><td>391 kcal / 1648 kJ</td></tr>
<tr><td>Fett</td><td>6,7 g</td><td>9,2 g</td></tr>
<tr><td>davon gesättigte Fettsäuren</td><td>3,8 g</td><td>5,2 g</td></tr>
<tr><td>Kohlenhydrate</td><td>32,9 g</td><td>45 g</td></tr>
<tr><td>davon Zucker</td><td>6,5 g</td><td>8,9 g</td></tr>
<tr><td>Ballaststoffe</td><td>6,1 g</td><td>8,3 g</td></tr>
<tr><td>Eiweiß</td><td>20,4 g</td><td>28 g</td></tr>
<tr><td>Salz</td><td>2,3 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Zutaten</h3>
<p>Sonnenblumenprotein 38,4%, vorgekochter Reis 27,4%, Kartoffelstärke, Kokosmilch (Kokosmilch, Maltodextrin, Natriumcaseinat (enthält <strong>Milch</strong>)), <strong>Milch</strong>protein, Cremer (Glukosesirup, Pflanzenfett, <strong>Milch</strong>protein, Stabilisator: E340, Trennmittel: E551, Emulgator: E471), Traubenzucker, Salz, Rohrzucker, natürliche Aromen, Currypulver, Limettensaftkonzentrat-Pulver (Maltodextrin), Karotte, Zwiebel, Kräuter, Gewürze und Koriander.</p>
<h3>Allergene</h3>
<p><strong>Enthält:</strong> Milch.</p>
<p><strong>Kann Spuren enthalten von:</strong> Weizen, Soja und Ei.</p>
<h3>Zubereitung</h3>
<p>Den geschlossenen Becher schütteln. Deckel entfernen, die empfohlene Menge kochendes Wasser hinzufügen — etwa 180 ml — und gut mit einer Gabel umrühren. 5 Minuten warten, erneut umrühren und genießen!</p>
<p>Nettogewicht: 73 g · Mindesthaltbarkeit: 12 Monate</p>`,
  },
  "plant-based-smoky-bbq-lentils": {
    approved: false,
    html: `<p>Smoky BBQ mit grünen Linsen — jetzt eingefangen in einem warmen Becher! Unser Gericht basiert auf einer großzügigen Grundlage aus strukturiertem Sonnenblumenprotein und grünen Linsen mit der Süße von geräuchertem Paprika, karamellisierten Zwiebeln und der würzigen Note von Knoblauch. Eine BBQ-Hommage für alle, die geschmackvolle Mahlzeiten lieben.</p>
<h3>Nährwerte</h3>
<table>
<thead><tr><th>Nährwert</th><th>Pro Becher (65 g)</th><th>Pro 100 g, Trockenmasse</th></tr></thead>
<tbody>
<tr><td>Energie</td><td>228 kcal / 954 kJ</td><td>351 kcal / 1481 kJ</td></tr>
<tr><td>Fett</td><td>2,9 g</td><td>4,5 g</td></tr>
<tr><td>davon gesättigte Fettsäuren</td><td>0,4 g</td><td>0,6 g</td></tr>
<tr><td>Kohlenhydrate</td><td>25,4 g</td><td>39 g</td></tr>
<tr><td>davon Zucker</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Ballaststoffe</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Eiweiß</td><td>20,8 g</td><td>32 g</td></tr>
<tr><td>Salz</td><td>2,0 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Zutaten</h3>
<p>Sonnenblumenprotein 38,5%, vorgekochte grüne Linsen 30,8%, Tomatenpulver, Rohrzucker, Kartoffelstärke, rote Paprika, Aromen, Salz, Zwiebel, Hefe, Karotte, karamellisierter Zucker (Pulver) (karamellisierter Zucker, Maltodextrin), Kräuter und Gewürze, Natriumdiacetat, Knoblauch.</p>
<h3>Allergene</h3>
<p><strong>Enthält:</strong> Keine (allergenfrei).</p>
<p><strong>Kann Spuren enthalten von:</strong> Weizen, Milch, Soja und Ei.</p>
<h3>Zubereitung</h3>
<p>Den geschlossenen Becher schütteln. Deckel entfernen, die empfohlene Menge kochendes Wasser hinzufügen — etwa 180 ml — und gut mit einer Gabel umrühren. 5 Minuten warten, erneut umrühren und genießen!</p>
<p>Nettogewicht: 65 g · Mindesthaltbarkeit: 12 Monate</p>`,
  },
};

export function getApprovedDeCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = DE_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

/** True once the German long text for this product has been reviewed. */
export function hasApprovedDeCopy(handle: string | undefined): boolean {
  return getApprovedDeCopy(handle) !== null;
}

/**
 * Only single flavours have their own ingredient/nutrition/allergen text that
 * must be reviewed. Bundles (Starter Pack) render their contents from bundle
 * data, so they never need a DE_PRODUCT_COPY entry.
 */
export const DE_HANDLES_REQUIRING_APPROVAL = [
  "plant-based-fusilli-bolognese",
  "plant-based-pasta-carbonara",
  "plant-based-yellow-curry-rice",
  "plant-based-smoky-bbq-lentils",
] as const;

export function needsApprovedDeCopy(handle: string): boolean {
  return (DE_HANDLES_REQUIRING_APPROVAL as readonly string[]).includes(canonicalizeHandle(handle));
}

/**
 * Whether the German page may be indexed and listed in the sitemap.
 *
 * German pilot pages reuse the approved English ingredient/nutrition/allergen
 * copy, so a flavour is ready as soon as its English counterpart is ready.
 * The dedicated German long text (DE_PRODUCT_COPY) is intentionally kept
 * unapproved until it has been reviewed; until then the English copy is used.
 */
export function isGermanPageReady(handle: string): boolean {
  const canonical = canonicalizeHandle(handle);
  if (!needsApprovedDeCopy(canonical)) return true;
  return hasApprovedEnCopy(canonical);
}
