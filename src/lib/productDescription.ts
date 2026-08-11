import type { Lang } from "./i18n";

// Ordered: longest phrases first so substring matches don't clobber larger ones.
const EN_TO_SV: Array<[RegExp, string]> = [
  // Preparation sentence (full match)
  [/Shake closed cup\.\s*Remove lid,\s*add\s*(\d+)\s*ml\s*boiling water,\s*stir well with a fork\.\s*Wait 5 minutes,\s*stir again and enjoy!/gi,
    "Skaka den stängda koppen. Ta av locket, tillsätt $1 ml kokande vatten och rör om väl med en gaffel. Vänta 5 minuter, rör om igen och njut!"],

  // Short marketing intros (run BEFORE word-level replacements so they match raw English)
  [/A sun-soaked flavour experience with rich, spicy bolognese sauce\.\s*Protein-based fusilli with (?:vegan|a creamy) bolognese sauce\./gi,
    "En solfylld smakupplevelse med rik, kryddig bolognesesås. Proteinrik fusilli med plantbaserad bolognesesås."],
  [/Creamy, peppery carbonara in classic Italian style\s*—\s*with a clever play of textures\.\s*Protein-based fusilli with (?:vegan|a creamy) carbonara sauce\./gi,
    "Krämig, pepprig carbonara i klassisk italiensk stil — med en lekfull kontrast i konsistens. Proteinrik fusilli med en krämig carbonarasås."],
  [/Smoky BBQ with smoked paprika,\s*caramelised onion and garlic\s*—\s*rich lentil texture,\s*maximum satiety\.\s*Protein-based green lentils with (?:vegan|a creamy) smoky BBQ sauce\./gi,
    "Rökig BBQ med sotad paprika, karamelliserad lök och vitlök. Proteinrika gröna linser med vegansk rökig BBQ sås."],
  [/Creamy coconut milk with curry,\s*coriander and lime\s*—\s*a trip to Southeast Asian street food\.\s*Protein-based rice with (?:vegan|a creamy) yellow curry sauce\./gi,
    "Krämig kokosmjölk med curry, koriander och lime — en resa till Sydostasiens gatukök. Proteinrikt ris med en krämig gul currysås."],
  [/Pick your mix of all 4 flavours\. 12 plant-based protein meals — free shipping in Sweden, delivered in 2–4 days\./gi,
    "Mix av alla 4 smaker. 12 växtbaserade proteinmåltider — levereras inom 1-2 dagar."],


  // Allergen labels
  [/<strong>\s*Contains:\s*<\/strong>/gi, "<strong>Innehåller:</strong>"],
  [/<strong>\s*May contain:\s*<\/strong>/gi, "<strong>Kan innehålla:</strong>"],
  [/\bContains:\s*/gi, "Innehåller: "],
  [/\bcontains\b/gi, "innehåller"],
  [/\bMay contain:\s*/gi, "Kan innehålla: "],
  [/None \(allergen free\)\./gi, "Inga (allergenfritt)."],

  // Headings
  [/Nutrition per serving\s*\(/gi, "Näringsinnehåll per portion ("],
  [/Nutrition per serving/gi, "Näringsinnehåll per portion"],
  [/>(\s*)Ingredients(\s*)</g, ">$1Ingredienser$2<"],
  [/>(\s*)Allergens(\s*)</g, ">$1Allergener$2<"],
  [/>(\s*)Preparation(\s*)</g, ">$1Tillagning$2<"],

  // Table headers
  [/>(\s*)Nutrient(\s*)</g, ">$1Näringsämne$2<"],
  [/>(\s*)Per serving(\s*)</g, ">$1Per portion$2<"],

  // Nutrient names (inside <td>)
  [/>(\s*)Energy(\s*)</g, ">$1Energi$2<"],
  [/>(\s*)Saturates(\s*)</g, ">$1Varav mättat fett$2<"],
  [/>(\s*)Carbohydrates(\s*)</g, ">$1Kolhydrater$2<"],
  [/>(\s*)Sugars(\s*)</g, ">$1Varav sockerarter$2<"],
  [/>(\s*)Fibre(\s*)</g, ">$1Fiber$2<"],
  [/>(\s*)Fibre(\s*)</g, ">$1Fiber$2<"],
  [/>(\s*)Protein(\s*)</g, ">$1Protein$2<"],
  [/>(\s*)Salt(\s*)</g, ">$1Salt$2<"],
  [/>(\s*)Fat(\s*)</g, ">$1Fett$2<"],

  // Footer line
  [/Net weight:/gi, "Nettovikt:"],
  [/Shelf life:/gi, "Hållbarhet:"],
  [/(\d+)\s*months\b/gi, "$1 månader"],

  // Ingredient terms (longest first)
  [/un-hydrogenated sunflower oil high oleic/gi, "icke-härdad högoljesyra solrosolja"],
  [/sunflower oil in powder/gi, "solrosolja i pulverform"],
  [/texturized sunflower proteins?/gi, "Texturerat solrosprotein"],
  [/texturised sunflower proteins?/gi, "Texturerat solrosprotein"],
  [/precooked green lentils/gi, "förkokta gröna linser"],
  [/precooked rice/gi, "förkokt ris"],
  [/processed cheese powder/gi, "smältostpulver"],
  [/caramelized sugar powder/gi, "karamelliserat lökpulver"],
  [/caramelised sugar powder/gi, "karamelliserat lökpulver"],
  [/caramelized sugar/gi, "karamelliserat socker"],
  [/caramelised sugar/gi, "karamelliserat socker"],
  [/lime concentrated juice powder/gi, "limejuicekoncentrat i pulverform"],
  [/lime juice concentrate/gi, "limejuicekoncentrat"],
  [/sodium caseinate/gi, "natriumkaseinat"],
  [/natural flavou?rings/gi, "naturliga aromer"],
  [/curry powder/gi, "currypulver"],
  [/coconut milk/gi, "kokosmjölk"],
  [/milk proteins?/gi, "mjölkprotein"],
  [/whey powder/gi, "vasslepulver"],
  [/glucose syrup/gi, "glukossirap"],
  [/vegetable fat/gi, "vegetabiliskt fett"],
  [/tomato powder/gi, "tomatpulver"],
  [/cane sugar/gi, "rörsocker"],
  [/black pepper/gi, "svartpeppar"],
  [/E262 sodium diacetate/gi, "E262 natriumdiacetat"],
  [/durum wheat semolina/gi, "durumvete"],
  [/pea protein isolate/gi, "ärtproteinisolat"],
  [/texturized pea proteins?/gi, "texturerat ärtprotein"],
  [/texturised pea proteins?/gi, "texturerat ärtprotein"],
  [/extra virgin olive oil/gi, "extra jungfruolivolja"],
  [/red bell pepper/gi, "röd paprika"],
  [/herbs\s*(?:&amp;|&)\s*spices/gi, "örter &amp; kryddor"],
  [/potato starch/gi, "potatisstärkelse"],
  [/flavou?rings/gi, "aromer"],
  [/\btomato\b/gi, "tomat"],
  [/\bonion\b/gi, "lök"],
  [/\bgarlic\b/gi, "vitlök"],
  [/\bcarrot\b/gi, "morot"],
  [/\bsugar\b/gi, "socker"],
  [/\bturmeric\b/gi, "gurkmeja"],
  [/\bcoriander\b/gi, "koriander"],
  [/\bdextrose\b/gi, "dextros"],
  [/\bmaltodextrin\b/gi, "maltodextrin"],
  [/\bcreamer\b/gi, "gräddpulver"],
  [/\byeast\b/gi, "jäst"],
  [/\bsalt\b/gi, "salt"],
  [/\bWheat\b/g, "Vete"],
  [/\bwheat\b/g, "vete"],
  [/\bSoy\b/g, "Soja"],
  [/\bsoy\b/g, "soja"],
  [/\begg\b/gi, "ägg"],
  [/\bmilk\b/gi, "mjölk"],
  [/\band\b/g, "och"],

];

// Reverse mapping for English output. Phrases must run before word-level swaps.
const SV_TO_EN: Array<[RegExp, string]> = [
  // Marketing intros (longest first)
  [/En solfylld smakupplevelse med rik, kryddig bolognesesås\.\s*Proteinrik fusilli med plantbaserad bolognesesås\./gi,
    "A sun-soaked flavour experience with rich, spicy bolognese sauce. Protein-based fusilli with vegan bolognese sauce."],
  [/Krämig, pepprig carbonara i klassisk italiensk stil\s*—\s*med en lekfull kontrast i konsistens\.\s*Proteinrik fusilli med en krämig carbonarasås\./gi,
    "Creamy, peppery carbonara in classic Italian style — with a clever play of textures. Protein-based fusilli with a creamy carbonara sauce."],
  [/Rökig BBQ med sotad paprika,\s*karamelliserad lök och vitlök\.\s*Proteinrika gröna linser med vegansk rökig BBQ sås\./gi,
    "Smoky BBQ with smoked paprika, caramelised onion and garlic — rich lentil texture, maximum satiety. Protein-based green lentils with vegan smoky BBQ sauce."],
  [/Krämig kokosmjölk med curry,\s*koriander och lime\s*—\s*en resa till Sydostasiens gatukök\.\s*Proteinrikt ris med en krämig gul currysås\./gi,
    "Creamy coconut milk with curry, coriander and lime — a trip to Southeast Asian street food. Protein-based rice with a creamy yellow curry sauce."],

  // Mixed SV/EN phrases that have leaked into Shopify data
  [/Creamy kokosmjölk with curry,\s*koriander och lime\s*—\s*a trip to Southeast Asian street food\.\s*Protein-based rice with a creamy yellow curry sauce\./gi,
    "Creamy coconut milk with curry, coriander and lime — a trip to Southeast Asian street food. Protein-based rice with a creamy yellow curry sauce."],
  [/Krämig, pepprig carbonara i klassisk italiensk stil\s*—\s*med en lekfull kontrast i konsistens\.\s*Protein-based fusilli with a creamy carbonara sauce\./gi,
    "Creamy, peppery carbonara in classic Italian style — with a clever play of textures. Protein-based fusilli with a creamy carbonara sauce."],
  [/Creamy, peppery carbonara in classic Italian style\s*—\s*with a clever play of textures\.\s*Proteinrik fusilli med en krämig carbonarasås\./gi,
    "Creamy, peppery carbonara in classic Italian style — with a clever play of textures. Protein-based fusilli with a creamy carbonara sauce."],
  [/A sun-soaked flavour experience with rich, spicy bolognese sauce\.\s*Proteinrik fusilli med plantbaserad bolognesesås\./gi,
    "A sun-soaked flavour experience with rich, spicy bolognese sauce. Protein-based fusilli with vegan bolognese sauce."],
  [/Rökig BBQ med sotad paprika,\s*karamelliserad lök och vitlök\s*—\s*rik linsstruktur,\s*maximal mättnad\.\s*Proteinbaserade gröna linser med vegansk rökig BBQ sås\./gi,
    "Smoky BBQ with smoked paprika, caramelised onion and garlic — rich lentil texture, maximum satiety. Protein-based green lentils with vegan smoky BBQ sauce."],

  // Allergen labels
  [/<strong>\s*Innehåller:\s*<\/strong>/gi, "<strong>Contains:</strong>"],
  [/<strong>\s*Kan innehålla:\s*<\/strong>/gi, "<strong>May contain:</strong>"],
  [/\bInnehåller:\s*/gi, "Contains: "],
  [/\binnehåller\b/gi, "contains"],
  [/\bKan innehålla:\s*/gi, "May contain: "],
  [/Inga \(allergenfritt\)\./gi, "None (allergen free)."],

  // Headings
  [/Näringsinnehåll per serving\s*\(/gi, "Nutrition per serving ("],
  [/Näringsinnehåll per serving/gi, "Nutrition per serving"],
  [/>(\s*)Ingredienser(\s*)</g, ">$1Ingredients$2<"],
  [/>(\s*)Allergener(\s*)</g, ">$1Allergens$2<"],
  [/>(\s*)Tillagning(\s*)</g, ">$1Preparation$2<"],

  // Table headers
  [/>(\s*)Näringsämne(\s*)</g, ">$1Nutrient$2<"],
  [/>(\s*)Per portion(\s*)</g, ">$1Per serving$2<"],

  // Nutrient names
  [/>(\s*)Energi(\s*)</g, ">$1Energy$2<"],
  [/>(\s*)Varav mättat fett(\s*)</g, ">$1Saturates$2<"],
  [/>(\s*)Kolhydrater(\s*)</g, ">$1Carbohydrates$2<"],
  [/>(\s*)Varav sockerarter(\s*)</g, ">$1Sugars$2<"],
  [/>(\s*)Fiber(\s*)</g, ">$1Fibre$2<"],
  [/>(\s*)Protein(\s*)</g, ">$1Protein$2<"],
  [/>(\s*)Salt(\s*)</g, ">$1Salt$2<"],
  [/>(\s*)Fett(\s*)</g, ">$1Fat$2<"],

  // Footer line
  [/Nettovikt:/gi, "Net weight:"],
  [/Hållbarhet:/gi, "Shelf life:"],
  [/(\d+)\s*månader\b/gi, "$1 months"],

  // Ingredient terms
  [/icke-härdad högoljesyra solrosolja/gi, "un-hydrogenated sunflower oil high oleic"],
  [/solrosolja i pulverform/gi, "sunflower oil in powder"],
  [/Texturerat solrosprotein/gi, "texturized sunflower protein"],
  [/texturerat solrosprotein/gi, "texturized sunflower protein"],
  [/förkokta gröna linser/gi, "precooked green lentils"],
  [/förkokt ris/gi, "precooked rice"],
  [/smältostpulver/gi, "processed cheese powder"],
  [/karamelliserat lökpulver/gi, "caramelized sugar powder"],
  [/karamelliserat socker/gi, "caramelized sugar"],
  [/limejuicekoncentrat i pulverform/gi, "lime concentrated juice powder"],
  [/limejuicekoncentrat/gi, "lime juice concentrate"],
  [/natriumkaseinat/gi, "sodium caseinate"],
  [/naturliga aromer/gi, "natural flavourings"],
  [/currypulver/gi, "curry powder"],
  [/kokosmjölk/gi, "coconut milk"],
  [/mjölkprotein/gi, "milk protein"],
  [/vasslepulver/gi, "whey powder"],
  [/glukossirap/gi, "glucose syrup"],
  [/vegetabiliskt fett/gi, "vegetable fat"],
  [/tomatpulver/gi, "tomato powder"],
  [/rörsocker/gi, "cane sugar"],
  [/svartpeppar/gi, "black pepper"],
  [/E262 natriumdiacetat/gi, "E262 sodium diacetate"],
  [/durumvete/gi, "durum wheat semolina"],
  [/ärtproteinisolat/gi, "pea protein isolate"],
  [/texturerat ärtprotein/gi, "texturized pea protein"],
  [/extra jungfruolivolja/gi, "extra virgin olive oil"],
  [/röd paprika/gi, "red bell pepper"],
  [/örter\s*&amp;\s*kryddor/gi, "herbs &amp; spices"],
  [/potatisstärkelse/gi, "potato starch"],
  [/aromer/gi, "flavourings"],
  [/\btomat\b/gi, "tomato"],
  [/\blök\b/gi, "onion"],
  [/\bvitlök\b/gi, "garlic"],
  [/\bmorot\b/gi, "carrot"],
  [/\bsocker\b/gi, "sugar"],
  [/\bgurkmeja\b/gi, "turmeric"],
  [/\bkoriander\b/gi, "coriander"],
  [/\bdextros\b/gi, "dextrose"],
  [/\bmaltodextrin\b/gi, "maltodextrin"],
  [/\bgräddpulver\b/gi, "creamer"],
  [/\bjäst\b/gi, "yeast"],
  [/\bsalt\b/gi, "salt"],
  [/\bVete\b/g, "Wheat"],
  [/\bvete\b/g, "wheat"],
  [/\bSoja\b/g, "Soy"],
  [/\bsoja\b/g, "soy"],
  [/\bägg\b/gi, "egg"],
  [/\bmjölk\b/gi, "milk"],
  [/\boch\b/g, "and"],
];

/**
 * Removes "vegan" / "100% plant-based" claims from Carbonara and Yellow Curry
 * copy (they contain milk protein). Bolognese and Smoky BBQ are untouched.
 */
export function sanitizeVeganClaims(input: string): string {
  return input
    // English
    .replace(/\bvegan\s+carbonara\s+sauce\b/gi, "a creamy carbonara sauce")
    .replace(/\bvegan\s+(yellow\s+)?curry\s+sauce\b/gi, (_m, y) => `a creamy ${y ? "yellow " : ""}curry sauce`)
    .replace(/\b(100%\s*)?vegan\s+(carbonara|yellow\s+curry|curry)\b/gi, (_m, _p, name) => `${name}`)
    .replace(/\b100%\s*plant[-\s]?based\s+(carbonara|yellow\s+curry|curry)\b/gi, "$1")
    // Swedish
    .replace(/\b(vegansk|plantbaserad|växtbaserad)\s+carbonarasås\b/gi, "en krämig carbonarasås")
    .replace(/\b(vegansk|plantbaserad|växtbaserad)\s+(gul\s+)?currysås\b/gi, (_m, _a, y) => `en krämig ${y ? "gul " : ""}currysås`)
    .replace(/\b100%\s*(plantbaserad|växtbaserad)t?\s+(carbonara|curry)\b/gi, "$2")
    .replace(/\bvegansk[at]?\s+(carbonara|yellow\s+curry|curry)\b/gi, "$1");
}

export function translateProductHtml(html: string | undefined | null, lang: Lang): string {
  // Carbonara and Yellow Curry contain milk protein — they may never be
  // described as "vegan"/"100% plant-based". Applies to SV and EN alike.
  if (!html) return "";
  html = sanitizeVeganClaims(html);
  if (lang !== "sv") {
    let out = html;
    for (const [re, rep] of SV_TO_EN) out = out.replace(re, rep);
    return sanitizeVeganClaims(out);
  }
  let out = html;
  for (const [re, rep] of EN_TO_SV) out = out.replace(re, rep);

  // Mixed-language phrases that have leaked into Shopify data need a hard
  // normalization because the regexes above expect pure English input.
  const mixedSvFixes: Array<[RegExp, string]> = [
    [/Creamy kokosmjölk with curry,\s*koriander och lime\s*—\s*a trip to Southeast Asian street food\.\s*Protein-based rice with a creamy yellow curry sauce\./gi,
      "Krämig kokosmjölk med curry, koriander och lime — en resa till sydostasiatisk gatumat. Proteinbaserat ris med en krämig gul currysås."],
    [/Creamy,\s*peppery carbonara in classic Italian style\s*—\s*with a clever play of textures\.\s*Proteinbaserad fusilli med en krämig carbonarasås\./gi,
      "Krämig, pepprig carbonara i klassisk italiensk stil — med ett smart samspel av texturer. Proteinbaserad fusilli med en krämig carbonarasås."],
    [/Krämig,\s*pepprig carbonara i klassisk italiensk stil\s*—\s*med ett smart samspel av texturer\.\s*Protein-based fusilli with a creamy carbonara sauce\./gi,
      "Krämig, pepprig carbonara i klassisk italiensk stil — med ett smart samspel av texturer. Proteinbaserad fusilli med en krämig carbonarasås."],
    [/A sun-soaked flavour experience with rich,\s*spicy bolognese sauce\.\s*Proteinrik fusilli med plantbaserad bolognesesås\./gi,
      "En solfylld smakupplevelse med rik, kryddig bolognesesås. Proteinrik fusilli med plantbaserad bolognesesås."],
    [/Smoky BBQ with smoked paprika,\s*caramelised onion and garlic\s*—\s*rich lentil texture,\s*maximum satiety\.\s*Proteinbaserade gröna linser med vegansk rökig BBQ sås\./gi,
      "Rökig BBQ med sotad paprika, karamelliserad lök och vitlök — rik linsstruktur, maximal mättnad. Proteinbaserade gröna linser med vegansk rökig BBQ sås."],
  ];
  for (const [re, rep] of mixedSvFixes) out = out.replace(re, rep);

  // Specific fix for the requested variations
  out = out.replace("Din mix av alla 4 smaker. 12 växtbaserade proteinmåltider — fri frakt i Sverige, levereras inom 2–4 dagar.", "Mix av alla 4 smaker. 12 växtbaserade proteinmåltider — levereras inom 1-2 dagar.");

  return sanitizeVeganClaims(out);
}

export function translateProductText(text: string | undefined | null, lang: Lang): string {
  return translateProductHtml(text || "", lang);
}
