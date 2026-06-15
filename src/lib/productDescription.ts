import type { Lang } from "./i18n";

// Ordered: longest phrases first so substring matches don't clobber larger ones.
const EN_TO_SV: Array<[RegExp, string]> = [
  // Preparation sentence (full match)
  [/Shake closed cup\.\s*Remove lid,\s*add\s*(\d+)\s*ml\s*boiling water,\s*stir well with a fork\.\s*Wait 5 minutes,\s*stir again and enjoy!/gi,
    "Skaka den stängda koppen. Ta av locket, tillsätt $1 ml kokande vatten och rör om väl med en gaffel. Vänta 5 minuter, rör om igen och njut!"],

  // Allergen labels
  [/<strong>\s*Contains:\s*<\/strong>/gi, "<strong>Innehåller:</strong>"],
  [/<strong>\s*May contain:\s*<\/strong>/gi, "<strong>Kan innehålla:</strong>"],
  [/\bContains:\s*/g, "Innehåller: "],
  [/\bMay contain:\s*/g, "Kan innehålla: "],

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

  // Ingredient terms
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
  [/\bWheat\b/g, "Vete"],
  [/\bwheat\b/g, "vete"],
  [/\bSoy\b/g, "Soja"],
  [/\bsoy\b/g, "soja"],
  [/\begg\b/gi, "ägg"],
  [/\bmilk\b/gi, "mjölk"],

  // Short marketing intros (per product)
  [/A sun-soaked flavour experience with rich, spicy bolognese sauce\.\s*Protein-based fusilli with vegan bolognese sauce\./gi,
    "En solfylld smakupplevelse med rik, kryddig bolognesesås. Proteinrik fusilli med plantbaserad bolognesesås."],
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
