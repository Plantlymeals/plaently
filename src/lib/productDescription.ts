import type { Lang } from "./i18n";

// Ordered: longest phrases first so substring matches don't clobber larger ones.
const EN_TO_SV: Array<[RegExp, string]> = [
  // Preparation sentence (full match)
  [/Shake closed cup\.\s*Remove lid,\s*add\s*(\d+)\s*ml\s*boiling water,\s*stir well with a fork\.\s*Wait 5 minutes,\s*stir again and enjoy!/gi,
    "Skaka den stängda koppen. Ta av locket, tillsätt $1 ml kokande vatten och rör om väl med en gaffel. Vänta 5 minuter, rör om igen och njut!"],

  // Short marketing intros (run BEFORE word-level replacements so they match raw English)
  [/A sun-soaked flavour experience with rich, spicy bolognese sauce\.\s*Protein-based fusilli with vegan bolognese sauce\./gi,
    "En solfylld smakupplevelse med rik, kryddig bolognesesås. Proteinrik fusilli med plantbaserad bolognesesås."],
  [/Creamy, peppery carbonara in classic Italian style\s*—\s*with a clever play of textures\.\s*Protein-based fusilli with vegan carbonara sauce\./gi,
    "Krämig, pepprig carbonara i klassisk italiensk stil — med ett smart samspel av texturer. Proteinrik fusilli med plantbaserad carbonarasås."],
  [/Smoky BBQ with smoked paprika,\s*caramelised onion and garlic\s*—\s*rich lentil texture,\s*maximum satiety\.\s*Protein-based green lentils with vegan smoky BBQ sauce\./gi,
    "Rökig BBQ med sotad paprika, karamelliserad lök och vitlök. Protein isolate med gröna linser med vegansk rökig BBQ sås."],
  [/Creamy coconut milk with curry,\s*coriander and lime\s*—\s*a trip to Southeast Asian street food\.\s*Protein-based rice with vegan yellow curry sauce\./gi,
    "Krämig kokosmjölk med curry, koriander och lime — en resa till sydostasiatisk gatumat."],

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
  [/>\s*Ingredients\s*</g, ">Ingredienser<"],
  [/>\s*Allergens\s*</g, ">Allergener<"],
  [/>\s*Preparation\s*</g, ">Tillagning<"],

  // Table headers
  [/>\s*Nutrient\s*</g, ">Näringsämne<"],
  [/>\s*Per serving\s*</g, ">Per portion<"],

  // Nutrient names (inside <td>)
  [/>\s*Energy\s*</g, ">Energi<"],
  [/>\s*Saturates\s*</g, ">Varav mättat fett<"],
  [/>\s*Carbohydrates\s*</g, ">Kolhydrater<"],
  [/>\s*Sugars\s*</g, ">Varav sockerarter<"],
  [/>\s*Fibre\s*</g, ">Fiber<"],
  [/>\s*Fiber\s*</g, ">Fiber<"],
  [/>\s*Protein\s*</g, ">Protein<"],
  [/>\s*Salt\s*</g, ">Salt<"],
  [/>\s*Fat\s*</g, ">Fett<"],

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

export function translateProductHtml(html: string | undefined | null, lang: Lang): string {
  if (!html) return "";
  if (lang !== "sv") return html;
  let out = html;
  for (const [re, rep] of EN_TO_SV) out = out.replace(re, rep);
  return out;
}

export function translateProductText(text: string | undefined | null, lang: Lang): string {
  return translateProductHtml(text || "", lang);
}
