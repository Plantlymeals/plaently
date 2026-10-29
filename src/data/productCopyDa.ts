import { canonicalizeHandle } from "@/lib/productSeo";

export const DA_PILOT_HANDLES = [
  "starter-pack-12-cups-1",
  "plant-based-fusilli-bolognese",
  "plant-based-pasta-carbonara",
  "plant-based-yellow-curry-rice",
  "plant-based-smoky-bbq-lentils",
  "bolognese-box-12-cups",
  "carbonara-box-12-cups",
  "smoky-lentils-box-12-cups",
  "yellow-curry-box-12-cups",
] as const;

export function isDanishPilotHandle(handle: string): boolean {
  return (DA_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

export type ApprovedDaCopy = { approved: boolean; html: string };

export const DA_PRODUCT_COPY: Record<string, ApprovedDaCopy> = {
  "plant-based-fusilli-bolognese": {
    approved: true,
    html: `<p>Ikke bare tomat — en solmoden smagsoplevelse! Vores hemmelighed? En generøs portion rød peberfrugt for mere dybde og kompleksitet, samt et skvæt ekstra jomfru olivenolie for en blid, frugtig eftersmag. Bliv med os på vores plantebaserede rejse til hjertet af Italien.</p>
<h3>Næringsværdi</h3>
<table>
<thead><tr><th>Næringsværdi</th><th>Pr. bæger (75 g)</th><th>Pr. 100 g tørstof</th></tr></thead>
<tbody>
<tr><td>Energi</td><td>263 kcal / 1109 kJ</td><td>350 kcal / 1479 kJ</td></tr>
<tr><td>Fedt</td><td>2,2 g</td><td>2,9 g</td></tr>
<tr><td>heraf mættede fedtsyrer</td><td>0,4 g</td><td>0,5 g</td></tr>
<tr><td>Kulhydrat</td><td>37,5 g</td><td>50 g</td></tr>
<tr><td>heraf sukkerarter</td><td>7,1 g</td><td>9,4 g</td></tr>
<tr><td>Kostfibre</td><td>5,9 g</td><td>7,8 g</td></tr>
<tr><td>Protein</td><td>20,3 g</td><td>27 g</td></tr>
<tr><td>Salt</td><td>2,4 g</td><td>3,2 g</td></tr>
</tbody>
</table>
<h3>Ingredienser</h3>
<p>Pasta (durum<strong>hvede</strong>semulje, ærteproteinisolat) 52%, teksturerede ærteproteiner 21%, tomat, kartoffelstivelse, aroma, løg, sukker, salt, gulerod, hvidløg, rød peberfrugt, krydderurter og krydderier, ekstra jomfru olivenolie.</p>
<h3>Allergener</h3>
<p><strong>Indeholder:</strong> hvede.</p>
<p><strong>Kan indeholde spor af:</strong> mælk, soja og æg.</p>
<h3>Tilberedning</h3>
<p>Ryst det lukkede bæger. Fjern låget, tilsæt den anbefalede mængde kogende vand — cirka 190 ml — og rør godt rundt med en gaffel. Vent 5 minutter, rør igen og nyd!</p>
<p>Nettovægt: 75 g · Mindst holdbar til: 12 måneder</p>`,
  },
  "plant-based-pasta-carbonara": {
    approved: true,
    html: `<p>Ikke bare ost og fløde — plantebaseret protein møder cremet pasta! Vores hemmelighed? Et raffineret samspil af ærtetekstur og en krydret dosis sort peber og hvidløg, der indfanger den klassiske italienske ånd. Bliv med os på vores plantebaserede rejse til hjertet af Rom — hvor carbonaraen møder fremtiden.</p>
<h3>Næringsværdi</h3>
<table>
<thead><tr><th>Næringsværdi</th><th>Pr. bæger (75 g)</th><th>Pr. 100 g tørstof</th></tr></thead>
<tbody>
<tr><td>Energi</td><td>285 kcal / 1202 kJ</td><td>380 kcal / 1602 kJ</td></tr>
<tr><td>Fedt</td><td>6,4 g</td><td>8,5 g</td></tr>
<tr><td>heraf mættede fedtsyrer</td><td>0,6 g</td><td>0,8 g</td></tr>
<tr><td>Kulhydrat</td><td>34,5 g</td><td>46 g</td></tr>
<tr><td>heraf sukkerarter</td><td>5,0 g</td><td>6,6 g</td></tr>
<tr><td>Kostfibre</td><td>4,3 g</td><td>5,8 g</td></tr>
<tr><td>Protein</td><td>20,2 g</td><td>27 g</td></tr>
<tr><td>Salt</td><td>2,9 g</td><td>3,9 g</td></tr>
</tbody>
</table>
<h3>Ingredienser</h3>
<p>Pasta (durum<strong>hvede</strong>semulje, ærteproteinisolat) 52%, teksturerede ærteproteiner 21%, valleprotein pulver (indeholder <strong>mælk</strong>), kartoffelstivelse, solsikkeoliepulver (ikke-hærdet high-oleic solsikkeolie, glukosesirup, <strong>mælke</strong>protein), smeltet ostepulver (indeholder <strong>mælk</strong>), aromaer (indeholder <strong>mælk</strong>), salt, sort peber, hvidløg, gurkemeje.</p>
<h3>Allergener</h3>
<p><strong>Indeholder:</strong> hvede og mælk.</p>
<p><strong>Kan indeholde spor af:</strong> soja og æg.</p>
<h3>Tilberedning</h3>
<p>Ryst det lukkede bæger. Fjern låget, tilsæt den anbefalede mængde kogende vand — cirka 170 ml — og rør godt rundt med en gaffel. Vent 5 minutter, rør igen og nyd!</p>
<p>Nettovægt: 75 g · Mindst holdbar til: 12 måneder</p>`,
  },
  "plant-based-yellow-curry-rice": {
    approved: true,
    html: `<p>En cremet eksplosion af varme, solrige aromaer! Vores plantebaserede karry er baseret på teksturerede solsikkeproteiner og en blid kokosmælkesauce, der balancerer karry og koriander perfekt. Serveret med ris — et komplet, eksotisk måltid klar på få minutter. En rejse til Sydøstasiens gadekøkken, fanget i et bæger.</p>
<h3>Næringsværdi</h3>
<table>
<thead><tr><th>Næringsværdi</th><th>Pr. bæger (73 g)</th><th>Pr. 100 g tørstof</th></tr></thead>
<tbody>
<tr><td>Energi</td><td>285 kcal / 1195 kJ</td><td>391 kcal / 1648 kJ</td></tr>
<tr><td>Fedt</td><td>6,7 g</td><td>9,2 g</td></tr>
<tr><td>heraf mættede fedtsyrer</td><td>3,8 g</td><td>5,2 g</td></tr>
<tr><td>Kulhydrat</td><td>32,9 g</td><td>45 g</td></tr>
<tr><td>heraf sukkerarter</td><td>6,5 g</td><td>8,9 g</td></tr>
<tr><td>Kostfibre</td><td>6,1 g</td><td>8,3 g</td></tr>
<tr><td>Protein</td><td>20,4 g</td><td>28 g</td></tr>
<tr><td>Salt</td><td>2,3 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ingredienser</h3>
<p>Teksturerede solsikkeproteiner 38,4%, forkogt ris 27,4%, kartoffelstivelse, kokosmælk (kokosmælk, maltodextrin, natriumkaseinat (indeholder <strong>mælk</strong>)), <strong>mælke</strong>protein, cremer (glukosesirup, vegetabilsk fedt, <strong>mælke</strong>protein, stabilisator: E340, antiklumpningsmiddel: E551, emulgator: E471), dextrose, salt, rørsukker, naturlige aromaer, karrypulver, limesaftkoncentratpulver (maltodextrin), gulerod, løg, krydderurter, krydderier og koriander.</p>
<h3>Allergener</h3>
<p><strong>Indeholder:</strong> mælk.</p>
<p><strong>Kan indeholde spor af:</strong> hvede, soja og æg.</p>
<h3>Tilberedning</h3>
<p>Ryst det lukkede bæger. Fjern låget, tilsæt den anbefalede mængde kogende vand — cirka 180 ml — og rør godt rundt med en gaffel. Vent 5 minutter, rør igen og nyd!</p>
<p>Nettovægt: 73 g · Mindst holdbar til: 12 måneder</p>`,
  },
  "plant-based-smoky-bbq-lentils": {
    approved: true,
    html: `<p>Røget BBQ med grønne linser — nu fanget i et varmt bæger! Vores ret er baseret på en generøs base af teksturerede solsikkeproteiner og grønne linser med sødmen fra røget paprika, karamelliserede løg og en krydret tone af hvidløg. En hyldest til BBQ for alle, der elsker smagfulde måltider.</p>
<h3>Næringsværdi</h3>
<table>
<thead><tr><th>Næringsværdi</th><th>Pr. bæger (65 g)</th><th>Pr. 100 g tørstof</th></tr></thead>
<tbody>
<tr><td>Energi</td><td>228 kcal / 954 kJ</td><td>351 kcal / 1468 kJ</td></tr>
<tr><td>Fedt</td><td>2,9 g</td><td>4,5 g</td></tr>
<tr><td>heraf mættede fedtsyrer</td><td>0,4 g</td><td>0,6 g</td></tr>
<tr><td>Kulhydrat</td><td>25,4 g</td><td>39 g</td></tr>
<tr><td>heraf sukkerarter</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Kostfibre</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Protein</td><td>20,8 g</td><td>32 g</td></tr>
<tr><td>Salt</td><td>2,0 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ingredienser</h3>
<p>Teksturerede solsikkeproteiner 38,5%, forkogte grønne linser 30,8%, tomatpulver, rørsukker, kartoffelstivelse, rød peberfrugt, aromaer, salt, løg, gær, gulerod, karamelliseret sukker pulver (karamelliseret sukker, maltodextrin), krydderurter og krydderier, E262 natriumdiacetat, hvidløg.</p>
<h3>Allergener</h3>
<p><strong>Indeholder:</strong> ingen (allergenfrit produkt).</p>
<p><strong>Kan indeholde spor af:</strong> hvede, mælk, soja og æg.</p>
<h3>Tilberedning</h3>
<p>Ryst det lukkede bæger. Fjern låget, tilsæt den anbefalede mængde kogende vand — cirka 180 ml — og rør godt rundt med en gaffel. Vent 5 minutter, rør igen og nyd!</p>
<p>Nettovægt: 65 g · Mindst holdbar til: 12 måneder</p>`,
  },
};

export function getApprovedDaCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = DA_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

export function hasApprovedDaCopy(handle: string | undefined): boolean {
  return getApprovedDaCopy(handle) !== null;
}

export function isDanishPageReady(handle: string | undefined): boolean {
  if (!handle) return false;
  const h = canonicalizeHandle(handle);
  const needsApproval = ["plant-based-fusilli-bolognese", "plant-based-pasta-carbonara", "plant-based-yellow-curry-rice", "plant-based-smoky-bbq-lentils"].includes(h);
  return needsApproval ? hasApprovedDaCopy(h) : isDanishPilotHandle(h);
}
