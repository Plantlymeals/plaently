import type { Lang } from "@/lib/i18n";

export interface CategorySection {
  heading: string;
  body: string[];
}

export interface RelatedLink {
  slug: string;
  label: string;
}

export interface QuickAnswerLink {
  label: string;
  path: string;
}

export interface QuickAnswer {
  title: string;
  body: string;
  links?: QuickAnswerLink[];
}

export interface ComparisonTable {
  heading: string;
  note: string;
  columns: string[];
  rows: { label: string; cells: string[]; highlight?: boolean }[];
}

export interface CategoryContent {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  quickAnswer?: QuickAnswer;
  comparison?: ComparisonTable;
  sections: CategorySection[];
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  ctaHeadline: string;
  ctaText: string;
  keywordLabel: string;
  related: RelatedLink[];
  breadcrumbName: string;
}


type CategoryKey =
  | "high-protein-meals"
  | "plant-based-meals"
  | "healthy-instant-meals"
  | "healthy-fast-food"
  | "protein-cups";

// SV slugs per category — used for canonical + hreflang on the SV side.
export const svSlugByKey: Record<CategoryKey, string> = {
  "high-protein-meals": "proteinrika-maltider",
  "plant-based-meals": "plantbaserade-maltider",
  "healthy-instant-meals": "halsosamma-snabbmaltider",
  "healthy-fast-food": "nyttig-snabbmat",
  "protein-cups": "proteinkoppar",
};

export const enSlugByKey: Record<CategoryKey, string> = {
  "high-protein-meals": "high-protein-meals",
  "plant-based-meals": "plant-based-meals",
  "healthy-instant-meals": "healthy-instant-meals",
  "healthy-fast-food": "healthy-fast-food",
  "protein-cups": "protein-cups",
};

const relatedEn = (exclude: CategoryKey): RelatedLink[] => [
  { slug: "/healthy-fast-food", label: "Healthy fast food" },
  { slug: "/high-protein-meals", label: "High protein meals" },
  { slug: "/plant-based-meals", label: "Plant-based meals" },
  { slug: "/protein-cups", label: "Protein cups" },
].filter((r) => r.slug !== `/${enSlugByKey[exclude]}`).slice(0, 3);

const relatedSv = (exclude: CategoryKey): RelatedLink[] => [
  { slug: "/nyttig-snabbmat", label: "Hälsosam snabbmat" },
  { slug: "/proteinrika-maltider", label: "Proteinrika måltider" },
  { slug: "/plantbaserade-maltider", label: "Plantbaserade måltider" },
  { slug: "/proteinkoppar", label: "Proteinkoppar" },
].filter((r) => r.slug !== `/${svSlugByKey[exclude]}`).slice(0, 3);

const content: Record<CategoryKey, Record<Lang, CategoryContent>> = {
  "high-protein-meals": {
    en: {
      slug: "high-protein-meals",
      breadcrumbName: "High Protein Meals",
      metaTitle: "High Protein Meals | 20g Protein Ready in 5 Minutes | PLÄNTLY",
      metaDescription: "High protein meals with 20g plant protein per serving. Ready in 5 minutes. No prep, no cooking, no compromise. Developed in Sweden. Crafted in Italy.",
      h1: "High Protein Meals.",
      keywordLabel: "High protein · Plant-based · Ready in 5 min",
      intro: "20g of plant protein in every meal, ready in 5 minutes. Real food for people who train, work and live at full pace.",
      sections: [
        {
          heading: "20g protein. Every meal. Every time.",
          body: [
            "Whether you train twice a week or twice a day — protein is non-negotiable. PLÄNTLY delivers 20g of plant protein per meal, consistently, in 5 minutes.",
            "Each cup is engineered around a pea and sunflower protein blend with a complete amino acid profile — matching whey on score and bioavailability, with the lighter digestion of plants.",
          ],
        },
        {
          heading: "No prep. No cooking. No excuses.",
          body: [
            "Meal prep takes time you don't always have. PLÄNTLY is your everyday high protein meal — ready in 5 minutes, wherever you are. Office, gym bag, kitchen counter.",
          ],
        },
        {
          heading: "Plant protein that performs.",
          body: [
            "The protein in PLÄNTLY comes from premium plant sources with a complete amino acid profile. The same performance — without the compromise on sustainability.",
            "Pair it with slow-release carbohydrates, healthy fats and 5–9g of fibre, and you have a meal designed to sustain focus and recovery — not spike and crash.",
          ],
        },
      ],
      benefits: [
        { title: "20g protein per serving", desc: "Complete amino acid profile from pea and sunflower protein." },
        { title: "5 minutes to ready", desc: "Just add hot water — real food, no waiting." },
        { title: "4 meals to choose from", desc: "Bolognese, Carbonara, Yellow Curry, Smokey Lentils." },
        { title: "0 artificial additives", desc: "Real ingredients only, nothing else." },
      ],
      quickAnswer: {
        title: "Short answer",
        body: "PLÄNTLY is a ready-made high protein meal with 20g of plant protein per cup — add boiling water, wait 5 minutes, eat. It works as lunch at the office, a post-training meal or whenever cooking is not an option. Two flavours are vegan (Fusilli Bolognese, Smoky BBQ Lentils) and two are vegetarian with milk protein (Pasta Carbonara, Yellow Curry & Rice).",
        links: [
          { label: "See our protein cups", path: "/products" },
          { label: "Full nutrition facts", path: "/nutrition" },
          { label: "Plant-based meals", path: "/plant-based-meals" },
        ],
      },
      comparison: {
        heading: "How does it compare to other fast protein?",
        note: "Prices are approximate Swedish retail prices per serving and will vary.",
        columns: ["Option", "Time", "Protein per serving", "Approx. price", "Needs a fridge"],
        rows: [
          { label: "PLÄNTLY cup", cells: ["5 min", "20–21g", "39 SEK", "No"], highlight: true },
          { label: "Protein shake", cells: ["1 min", "20–25g", "10–15 SEK", "No (powder), yes (milk)"] },
          { label: "Eating out", cells: ["20–45 min incl. travel", "Varies, often unlisted", "110–160 SEK", "No"] },
          { label: "Cooking from scratch", cells: ["25–40 min", "You decide", "25–45 SEK", "Yes"] },
        ],
      },
      faqs: [
        { q: "What counts as a high protein meal?", a: "In practice, a meal with roughly 20g of protein or more, where protein makes up a meaningful share of the calories. A PLÄNTLY cup has 20–21g of protein per serving alongside slow carbohydrates and 5–9g of fibre. We list the full numbers on the nutrition page rather than hiding behind long additive lists." },
        { q: "How much protein do I need per day?", a: "Common guidance is around 0.8g per kilo of body weight for adults, and roughly 1.2–2.0g per kilo if you train regularly. For a 70 kg person that is about 56g to 140g per day. Spreading it across meals is easier than trying to catch up at dinner." },
        { q: "Are ready-made protein meals healthy?", a: "It depends entirely on what is inside. Look at protein, fibre, salt and the ingredient list. PLÄNTLY is built on pasta, legumes, vegetables and spices with no artificial additives — but it is one meal in your day, not a replacement for a varied diet." },
        { q: "Can you eat high protein food every day?", a: "Yes, for most healthy adults a protein-rich diet every day is fine. Vary your protein sources and keep fibre, vegetables and fluids up. If you have kidney disease or another medical condition, talk to your doctor first." },
      ],

      ctaHeadline: "20g protein. 5 minutes. No compromise.",
      ctaText: "Shop now",
      related: relatedEn("high-protein-meals"),
    },
    sv: {
      slug: "proteinrika-maltider",
      breadcrumbName: "Proteinrika måltider",
      metaTitle: "Proteinrika måltider | 20g protein på 5 minuter | PLÄNTLY",
      metaDescription: "Proteinrika måltider med 20g plantprotein per portion. Klart på 5 minuter. Ingen förberedelse, ingen matlagning, ingen kompromiss. Utvecklat i Sverige. Hantverk från Italien.",
      h1: "Proteinrika måltider.",
      keywordLabel: "Högprotein · Plantbaserat · Klart på 5 min",
      intro: "20g plantprotein i varje måltid, klart på 5 minuter. Riktig mat för dig som tränar, jobbar och lever i fullt tempo.",
      sections: [
        {
          heading: "20g protein. Varje måltid. Varje gång.",
          body: [
            "Oavsett om du tränar två gånger i veckan eller två gånger om dagen — protein är inte förhandlingsbart. PLÄNTLY levererar 20g plantprotein per måltid, konsekvent, på 5 minuter.",
            "Varje kopp är byggd kring en blandning av ärt- och solrosprotein med komplett aminosyraprofil — som matchar vassle på poäng och biotillgänglighet, med plantans lättare matsmältning.",
          ],
        },
        {
          heading: "Ingen förberedelse. Ingen matlagning. Inga ursäkter.",
          body: [
            "Meal prep tar tid du inte alltid har. PLÄNTLY är din vardagsmåltid med högt protein — klar på 5 minuter, var du än är. Kontoret, gympaväskan, köksbänken.",
          ],
        },
        {
          heading: "Plantprotein som presterar.",
          body: [
            "Proteinet i PLÄNTLY kommer från premium plantkällor med komplett aminosyraprofil. Samma prestation — utan kompromiss med hållbarheten.",
            "Kombinera det med långsamma kolhydrater, hälsosamma fetter och 5–9g fiber så har du en måltid designad för fokus och återhämtning — utan toppar och dippar.",
          ],
        },
      ],
      benefits: [
        { title: "20g protein per portion", desc: "Komplett aminosyraprofil från ärt- och solrosprotein." },
        { title: "Klart på 5 minuter", desc: "Tillsätt bara hett vatten — riktig mat, ingen väntan." },
        { title: "4 måltider att välja mellan", desc: "Bolognese, Carbonara, Gul Curry, Smokey Lentils." },
        { title: "0 konstgjorda tillsatser", desc: "Bara riktiga ingredienser, inget annat." },
      ],
      quickAnswer: {
        title: "Kort svar",
        body: "PLÄNTLY är färdiga proteinmåltider med 20g protein per kopp — bara tillsätt kokande vatten och vänta 5 minuter. Perfekt som lunch på kontoret, mellanmål efter träning eller när matlagning inte är ett alternativ. Två smaker är veganska (Fusilli Bolognese, Smoky BBQ Lentils) och två är vegetariska med mjölkprotein (Pasta Carbonara, Yellow Curry & Rice).",
        links: [
          { label: "Se våra proteinkoppar", path: "/products" },
          { label: "Hela näringsinnehållet", path: "/nutrition" },
          { label: "Plantbaserade måltider", path: "/plantbaserade-maltider" },
        ],
      },
      comparison: {
        heading: "Hur står sig PLÄNTLY mot andra snabba proteinkällor?",
        note: "Priserna är ungefärliga svenska konsumentpriser per portion och varierar.",
        columns: ["Alternativ", "Tid att tillaga", "Protein per portion", "Ungefärligt pris", "Kylskåpskrav"],
        rows: [
          { label: "PLÄNTLY-kopp", cells: ["5 min", "20–21g", "39 kr", "Nej"], highlight: true },
          { label: "Proteinpulver / shake", cells: ["1 min", "20–25g", "10–15 kr", "Nej (pulver), ja (mjölk)"] },
          { label: "Äta ute", cells: ["20–45 min inkl. restid", "Varierar, sällan angivet", "110–160 kr", "Nej"] },
          { label: "Laga mat från grunden", cells: ["25–40 min", "Du bestämmer", "25–45 kr", "Ja"] },
        ],
      },
      faqs: [
        { q: "Vad räknas som en proteinrik måltid?", a: "I praktiken en måltid med ungefär 20g protein eller mer, där proteinet står för en meningsfull del av kalorierna. En PLÄNTLY-kopp har 20–21g protein per portion tillsammans med långsamma kolhydrater och 5–9g fiber. Vi redovisar hela näringsinnehållet öppet istället för att gömma oss bakom långa tillsatslistor." },
        { q: "Hur mycket protein behöver jag äta per dag?", a: "Vanlig rekommendation för vuxna är runt 0,8g per kilo kroppsvikt, och ungefär 1,2–2,0g per kilo om du tränar regelbundet. För en person på 70 kg blir det cirka 56–140g per dag. Det är lättare att fördela proteinet över dagens måltider än att ta igen allt på middagen." },
        { q: "Är färdiga proteinmåltider nyttiga?", a: "Det beror helt på innehållet. Titta på protein, fiber, salt och ingredienslistan. PLÄNTLY är byggd på pasta, baljväxter, grönsaker och kryddor utan konstgjorda tillsatser — men det är en måltid i din dag, inte en ersättning för en varierad kost." },
        { q: "Kan man äta proteinrik mat varje dag?", a: "Ja, för de flesta friska vuxna går det bra att äta proteinrikt varje dag. Variera dina proteinkällor och håll uppe fiber, grönsaker och vätska. Har du njursjukdom eller annan sjukdom bör du prata med din läkare först." },
      ],

      ctaHeadline: "20g protein. 5 minuter. Ingen kompromiss.",
      ctaText: "Handla nu",
      related: relatedSv("high-protein-meals"),
    },
  },
  "plant-based-meals": {
    en: {
      slug: "plant-based-meals",
      breadcrumbName: "Plant-Based Meals",
      metaTitle: "Plant-Based Meals | 20g Protein | Ready in 5 Minutes | PLÄNTLY",
      metaDescription: "Plant-based meals with 20g protein per serving. Not just for plant-based eaters — for everyone who wants to eat smarter. Ready in 5 minutes. Developed in Sweden. Crafted in Italy.",
      h1: "Plant-Based Meals.",
      keywordLabel: "Plant-based · Real food · Lower footprint",
      intro: "Plant-based meals with 20g of protein, ready in 5 minutes. Not a label — a smarter choice.",
      sections: [
        {
          heading: "Not just for plant-based eaters. For everyone.",
          body: [
            "Eating plant-based is not a statement. It is a smarter choice — for your body, for the planet, for your routine. PLÄNTLY plant-based meals deliver 20g of protein, ready in 5 minutes. No label required.",
          ],
        },
        {
          heading: "The climate case for plant protein.",
          body: [
            "Plant protein produces up to 90% less CO2 than beef protein. One PLÄNTLY meal instead of a meat-based lunch is one of the highest-impact climate choices you can make today — without changing anything else.",
          ],
        },
        {
          heading: "Same protein. Fraction of the footprint.",
          body: [
            "Beyond protein, every meal includes slow-release carbohydrates, healthy fats from olive oil and nuts, and 5–9g of gut-friendly fibre. Real ingredients you can pronounce — lentils, pasta, vegetables, herbs, spices.",
          ],
        },
        {
          heading: "Developed in Sweden. Crafted in Italy.",
          body: [
            "PLÄNTLY was developed in Sweden — where plant-based eating is not a trend, it is a mindset. Every recipe is crafted in Italy, where food quality is non-negotiable.",
          ],
        },
      ],
      benefits: [
        { title: "20g plant protein per meal", desc: "Complete amino acid profile, every cup." },
        { title: "Up to 90% lower CO2 vs beef", desc: "One of the highest-impact climate choices." },
        { title: "5 minutes to ready", desc: "Hot water. Stir. Wait. Eat." },
        { title: "0 artificial additives", desc: "Real ingredients, nothing else." },
      ],
      quickAnswer: {
        title: "Short answer",
        body: "PLÄNTLY plant-based meals are cups of real food — pasta, legumes, vegetables and spices — with 20g of plant protein per serving, ready in 5 minutes with boiling water. Two flavours are fully vegan: Fusilli Bolognese and Smoky BBQ Lentils. Pasta Carbonara and Yellow Curry & Rice are vegetarian, not vegan: they contain milk protein. We say that plainly instead of hiding it in a long ingredient list.",
        links: [
          { label: "See our protein cups", path: "/products" },
          { label: "Full nutrition facts", path: "/nutrition" },
          { label: "High protein meals", path: "/high-protein-meals" },
        ],
      },
      comparison: {
        heading: "Plant protein compared to other quick options",
        note: "Prices are approximate Swedish retail prices per serving and will vary.",
        columns: ["Option", "Time", "Protein per serving", "Approx. price", "Needs a fridge"],
        rows: [
          { label: "PLÄNTLY cup", cells: ["5 min", "20–21g", "39 SEK", "No"], highlight: true },
          { label: "Plant protein shake", cells: ["1 min", "20–25g", "10–15 SEK", "No (powder), yes (plant milk)"] },
          { label: "Eating out", cells: ["20–45 min incl. travel", "Varies, often unlisted", "110–160 SEK", "No"] },
          { label: "Cooking from scratch", cells: ["25–40 min", "You decide", "25–45 SEK", "Yes"] },
        ],
      },
      faqs: [
        { q: "What is a plant-based meal?", a: "A meal built mainly on plants — vegetables, legumes, grains, nuts and seeds — instead of meat and fish. Plant-based is not automatically vegan: a plant-based meal can still contain small amounts of dairy or egg, which is why we label each PLÄNTLY flavour as vegan or vegetarian." },
        { q: "Is plant protein as good as animal protein?", a: "For most people, yes, as long as you combine sources. Legumes and grains complement each other so the amino acid profile ends up complete. PLÄNTLY combines pea and sunflower protein with pasta or rice and legumes for that reason." },
        { q: "Are plant-based meals good for weight loss?", a: "They can help, mainly because fibre and protein make it easier to feel full on fewer calories. But there is no magic in the label — total calories over the week is what decides. A PLÄNTLY cup is 228–285 kcal per serving, so you can plan around it." },
        { q: "Which nutrients should vegans pay extra attention to?", a: "Vitamin B12, iron, calcium, iodine, omega-3 (EPA/DHA), zinc and vitamin D are the ones usually flagged. B12 needs a supplement or fortified foods on a fully vegan diet. PLÄNTLY is a meal, not a supplement — check the nutrition page for what each cup actually delivers." },
      ],

      ctaHeadline: "Same protein. Fraction of the footprint.",
      ctaText: "Shop now",
      related: relatedEn("plant-based-meals"),
    },
    sv: {
      slug: "plantbaserade-maltider",
      breadcrumbName: "Plantbaserade måltider",
      metaTitle: "Plantbaserade måltider | 20g protein | Klart på 5 minuter | PLÄNTLY",
      metaDescription: "Plantbaserade måltider med 20g protein per portion. Inte bara för plantbaserade — för alla som vill äta smartare. Klart på 5 minuter. Utvecklat i Sverige. Hantverk från Italien.",
      h1: "Plantbaserade måltider.",
      keywordLabel: "Plantbaserat · Riktig mat · Lägre avtryck",
      intro: "Plantbaserade måltider med 20g protein, klart på 5 minuter. Inte en etikett — ett smartare val.",
      sections: [
        {
          heading: "Inte bara för plantbaserade. För alla.",
          body: [
            "Att äta plantbaserat är inte ett ställningstagande. Det är ett smartare val — för kroppen, för planeten, för din rutin. PLÄNTLY:s plantbaserade måltider levererar 20g protein, klart på 5 minuter. Ingen etikett krävs.",
          ],
        },
        {
          heading: "Klimatargumentet för plantprotein.",
          body: [
            "Plantprotein ger upp till 90% mindre CO2 än nötkött. En PLÄNTLY-måltid istället för en köttlunch är ett av de mest effektiva klimatval du kan göra idag — utan att ändra något annat.",
          ],
        },
        {
          heading: "Samma protein. Bråkdel av avtrycket.",
          body: [
            "Utöver protein innehåller varje måltid långsamma kolhydrater, hälsosamma fetter från olivolja och nötter, och 5–9g tarmvänlig fiber. Riktiga ingredienser du kan uttala — linser, pasta, grönsaker, örter, kryddor.",
          ],
        },
        {
          heading: "Utvecklat i Sverige. Hantverk från Italien.",
          body: [
            "PLÄNTLY utvecklades i Sverige — där plantbaserat ätande inte är en trend, utan ett tankesätt. Varje recept har sitt hantverk i Italien, där matkvalitet inte är förhandlingsbar.",
          ],
        },
      ],
      benefits: [
        { title: "20g plantprotein per måltid", desc: "Komplett aminosyraprofil, varje kopp." },
        { title: "Upp till 90% lägre CO2 vs nötkött", desc: "Ett av de mest effektiva klimatvalen." },
        { title: "Klart på 5 minuter", desc: "Hett vatten. Rör. Vänta. Ät." },
        { title: "0 konstgjorda tillsatser", desc: "Riktiga ingredienser, inget annat." },
      ],
      quickAnswer: {
        title: "Kort svar",
        body: "PLÄNTLY:s växtbaserade måltider är koppar med riktig mat — pasta, baljväxter, grönsaker och kryddor — med 20g växtprotein per portion, klara på 5 minuter med kokande vatten. Två smaker är helt veganska: Fusilli Bolognese och Smoky BBQ Lentils. Pasta Carbonara och Yellow Curry & Rice är vegetariska, inte veganska: de innehåller mjölkprotein. Vi skriver ut det rakt istället för att gömma det i en lång ingredienslista.",
        links: [
          { label: "Se våra proteinkoppar", path: "/products" },
          { label: "Hela näringsinnehållet", path: "/nutrition" },
          { label: "Proteinrika måltider", path: "/proteinrika-maltider" },
        ],
      },
      comparison: {
        heading: "Växtprotein jämfört med andra snabba alternativ",
        note: "Priserna är ungefärliga svenska konsumentpriser per portion och varierar.",
        columns: ["Alternativ", "Tid att tillaga", "Protein per portion", "Ungefärligt pris", "Kylskåpskrav"],
        rows: [
          { label: "PLÄNTLY-kopp", cells: ["5 min", "20–21g", "39 kr", "Nej"], highlight: true },
          { label: "Växtbaserat proteinpulver", cells: ["1 min", "20–25g", "10–15 kr", "Nej (pulver), ja (växtmjölk)"] },
          { label: "Äta ute", cells: ["20–45 min inkl. restid", "Varierar, sällan angivet", "110–160 kr", "Nej"] },
          { label: "Laga mat från grunden", cells: ["25–40 min", "Du bestämmer", "25–45 kr", "Ja"] },
        ],
      },
      faqs: [
        { q: "Vad är en växtbaserad måltid?", a: "En måltid som huvudsakligen bygger på växter — grönsaker, baljväxter, spannmål, nötter och frön — istället för kött och fisk. Växtbaserat är inte automatiskt veganskt: en växtbaserad måltid kan innehålla mindre mängder mjölk eller ägg. Därför märker vi varje PLÄNTLY-smak som vegansk eller vegetarisk." },
        { q: "Är växtbaserat protein lika bra som animaliskt?", a: "För de flesta ja, så länge du kombinerar källor. Baljväxter och spannmål kompletterar varandra så att aminosyraprofilen blir komplett. Det är därför PLÄNTLY kombinerar ärt- och solrosprotein med pasta eller ris och baljväxter." },
        { q: "Passar växtbaserade måltider för viktnedgång?", a: "De kan hjälpa, främst för att fiber och protein gör det lättare att bli mätt på färre kalorier. Men det finns ingen magi i etiketten — det är totala kalorier över veckan som avgör. En PLÄNTLY-kopp ligger på 228–285 kcal per portion, så det går att planera runt." },
        { q: "Vilka näringsämnen bör veganer vara extra uppmärksamma på?", a: "Vitamin B12, järn, kalcium, jod, omega-3 (EPA/DHA), zink och D-vitamin är de som brukar lyftas. B12 kräver kosttillskott eller berikade livsmedel vid helt vegansk kost. PLÄNTLY är en måltid, inte ett kosttillskott — se näringssidan för exakt vad varje kopp ger." },
      ],

      ctaHeadline: "Samma protein. Bråkdel av avtrycket.",
      ctaText: "Handla nu",
      related: relatedSv("plant-based-meals"),
    },
  },
  "healthy-instant-meals": {
    en: {
      slug: "healthy-instant-meals",
      breadcrumbName: "Healthy Instant Meals",
      metaTitle: "Healthy Instant Meals | Real Food in 5 Minutes | PLÄNTLY",
      metaDescription: "Healthy instant meals with 20g plant protein and balanced nutrition. The smart way to eat fast without sacrificing real food.",
      h1: "Healthy Instant Meals.",
      keywordLabel: "Instant · Healthy · Real ingredients",
      intro: "PLÄNTLY proves that 'instant' and 'healthy' belong in the same sentence. Real ingredients, 20g of plant protein, ready in 5 minutes.",
      sections: [
        {
          heading: "The instant food problem — solved.",
          body: [
            "For decades, instant meals meant a trade-off: speed in exchange for sodium bombs, refined carbs and low protein. The category got faster, but it never got better.",
            "PLÄNTLY rebuilds the instant meal from scratch. Same convenience, completely different nutrition profile — 20g of complete plant protein, balanced macros, real ingredients.",
          ],
        },
        {
          heading: "Healthy fast food, finally.",
          body: [
            "PLÄNTLY refuses the trade-off between speed, taste and nutrition. Our meals are designed to deliver all three — without packaged shortcuts that compromise quality.",
            "Whether you're working late, between meetings or hungry after a workout, you shouldn't settle for something that leaves you sluggish.",
          ],
        },
        {
          heading: "Perfect for the modern day.",
          body: [
            "Office desks, hotel rooms, university dorms, gym bags — PLÄNTLY fits anywhere a kettle does. No kitchen, no cooking skills, no shopping trips. Just real food when you need it.",
          ],
        },
      ],
      benefits: [
        { title: "Real ingredients", desc: "No fillers, no artificial flavours, no shortcuts." },
        { title: "5-minute prep", desc: "Just add hot water — your kettle is the only tool you need." },
        { title: "20g plant protein", desc: "More protein than most cooked-from-scratch meals." },
        { title: "Portable", desc: "Take it anywhere — desk, gym, travel, home." },
      ],
      faqs: [
        { q: "How is this different from instant noodles?", a: "PLÄNTLY contains real ingredients, 20g of plant protein, balanced macros and zero artificial fillers — instant noodles offer none of these." },
        { q: "How long do they take to prepare?", a: "5 minutes. Add hot water, stir, wait, eat." },
        { q: "Do I need anything besides water?", a: "Just a cup of boiling water — that's it. No cooking, no microwave, no extra ingredients." },
      ],
      ctaHeadline: "Try healthy instant meals.",
      ctaText: "Shop now",
      related: relatedEn("healthy-instant-meals"),
    },
    sv: {
      slug: "halsosamma-snabbmaltider",
      breadcrumbName: "Hälsosamma snabbmåltider",
      metaTitle: "Hälsosamma snabbmåltider | Riktig mat på 5 min | PLÄNTLY",
      metaDescription: "Hälsosamma snabbmåltider med 20g plantprotein och balanserad näring. Det smarta sättet att äta snabbt — utan att offra riktig mat.",
      h1: "Hälsosamma snabbmåltider.",
      keywordLabel: "Snabb · Hälsosam · Riktiga ingredienser",
      intro: "PLÄNTLY bevisar att 'snabb' och 'hälsosam' hör hemma i samma mening. Riktiga ingredienser, 20g plantprotein, klart på 5 minuter.",
      sections: [
        {
          heading: "Snabbmatsproblemet — löst.",
          body: [
            "I årtionden har snabbmåltider betytt en kompromiss: hastighet i utbyte mot saltbomber, raffinerade kolhydrater och lågt protein. Kategorin blev snabbare men aldrig bättre.",
            "PLÄNTLY bygger om snabbmåltiden från grunden. Samma bekvämlighet, helt annan näringsprofil — 20g komplett plantprotein, balanserade makron, riktiga ingredienser.",
          ],
        },
        {
          heading: "Hälsosam snabbmat, äntligen.",
          body: [
            "PLÄNTLY vägrar kompromissen mellan hastighet, smak och näring. Våra måltider är designade att leverera alla tre — utan genvägar som sänker kvaliteten.",
            "Oavsett om du jobbar sent, är mellan möten eller hungrig efter träning ska du inte behöva nöja dig med något som gör dig trög.",
          ],
        },
        {
          heading: "Perfekt för det moderna livet.",
          body: [
            "Kontorsskrivbord, hotellrum, studentkorridorer, gympaväskor — PLÄNTLY passar överallt där en vattenkokare passar. Inget kök, inga matlagningskunskaper, ingen butiksrunda.",
          ],
        },
      ],
      benefits: [
        { title: "Riktiga ingredienser", desc: "Inga fyllmedel, inga konstgjorda smaker, inga genvägar." },
        { title: "5 minuters tillagning", desc: "Tillsätt bara hett vatten — vattenkokaren är allt du behöver." },
        { title: "20g plantprotein", desc: "Mer protein än de flesta måltider lagade från grunden." },
        { title: "Portabel", desc: "Ta med den var som helst — skrivbord, gym, resa, hemma." },
      ],
      faqs: [
        { q: "Hur skiljer sig detta från snabbnudlar?", a: "PLÄNTLY innehåller riktiga ingredienser, 20g plantprotein, balanserade makron och noll konstgjorda fyllmedel — snabbnudlar erbjuder inget av detta." },
        { q: "Hur lång tid tar det att tillaga?", a: "5 minuter. Tillsätt hett vatten, rör om, vänta, ät." },
        { q: "Behöver jag något annat än vatten?", a: "Bara en kopp kokande vatten — det är allt. Ingen matlagning, ingen mikro, inga extra ingredienser." },
      ],
      ctaHeadline: "Prova hälsosamma snabbmåltider.",
      ctaText: "Handla nu",
      related: relatedSv("healthy-instant-meals"),
    },
  },
  "healthy-fast-food": {
    en: {
      slug: "healthy-fast-food",
      breadcrumbName: "Healthy Fast Food",
      metaTitle: "Healthy Fast Food | 20g Protein in 5 Minutes | PLÄNTLY",
      metaDescription: "Healthy fast food that actually delivers. 20g protein per meal, ready in 5 minutes. Developed in Sweden. Crafted in Italy. No compromise.",
      h1: "Healthy Fast Food.",
      keywordLabel: "A new category · Plant protein · 5 minutes",
      intro: "PLÄNTLY is rewriting the rules of fast food. Real meals, 20g of plant protein, ready in the time it takes to boil water.",
      sections: [
        {
          heading: "Fast food. Rewritten.",
          body: [
            "Fast food was never the problem. Compromise was. PLÄNTLY meals are ready in 5 minutes — the same time as any fast food — but with 20g of protein, real ingredients, and zero regret.",
          ],
        },
        {
          heading: "20g protein. 5 minutes. No compromise.",
          body: [
            "Every PLÄNTLY meal is engineered around one rule: it has to be as fast as fast food, and as good as a proper meal. Developed in Sweden. Crafted in Italy.",
          ],
        },
        {
          heading: "The future of convenience food.",
          body: [
            "Convenience and nutrition have always been traded against each other. We ended that trade. PLÄNTLY is healthy fast food — not a compromise between the two.",
          ],
        },
      ],
      benefits: [
        { title: "20g plant protein", desc: "Complete amino acid profile in every meal." },
        { title: "Ready in 5 minutes", desc: "Just add hot water. Real food, no waiting." },
        { title: "Developed in Sweden", desc: "Engineered to Scandinavian nutrition standards." },
        { title: "Crafted in Italy", desc: "Made with Italian producers who treat food as craft." },
      ],
      quickAnswer: {
        title: "Short answer",
        body: "PLÄNTLY is healthy fast food in a cup: pasta, legumes, vegetables and spices with 20g of plant protein, ready in 5 minutes with boiling water. It is as fast as a takeaway lunch, but you can read every ingredient. Two flavours are vegan (Fusilli Bolognese, Smoky BBQ Lentils) and two are vegetarian with milk protein (Pasta Carbonara, Yellow Curry & Rice).",
        links: [
          { label: "See our protein cups", path: "/products" },
          { label: "High protein meals", path: "/high-protein-meals" },
          { label: "Plant-based meals", path: "/plant-based-meals" },
        ],
      },
      faqs: [
        { q: "Is healthy fast food more expensive than regular fast food?", a: "Per meal, it is usually cheaper than eating out. A PLÄNTLY cup is 39 SEK, while a takeaway lunch in Sweden typically costs 110–160 SEK. Compared to cooking a big batch at home it is more expensive — you are paying for the time you save." },
        { q: "What is the difference between healthy fast food and regular ready meals?", a: "Mostly the ingredient list and what the meal actually delivers. Many ready meals are built for shelf life and cost, with high salt and little fibre. PLÄNTLY is built around 20g of protein and 5–9g of fibre with no artificial additives — and we publish the numbers instead of hiding behind long additive lists." },
        { q: "Do instant meals keep for a long time?", a: "Yes. Because PLÄNTLY cups are dry, they keep for months at room temperature — the best before date is printed on each cup. No fridge, no freezer, which is exactly why they work in a desk drawer or a gym bag." },
        { q: "Is dried food with added water actually healthy?", a: "Drying is just water removal — it does not make food unhealthy in itself. What matters is what was dried: our cups contain durum pasta, legumes, vegetables, herbs and spices. Add boiling water and you get the meal back, not a powder shake." },
      ],

      ctaHeadline: "The future of fast food. Today.",
      ctaText: "Shop meals",
      related: relatedEn("healthy-fast-food"),
    },
    sv: {
      slug: "nyttig-snabbmat",
      breadcrumbName: "Hälsosam snabbmat",
      metaTitle: "Hälsosam snabbmat | 20g protein på 5 minuter | PLÄNTLY",
      metaDescription: "Hälsosam snabbmat som faktiskt levererar. 20g protein per måltid, klart på 5 minuter. Utvecklat i Sverige. Hantverk från Italien. Ingen kompromiss.",
      h1: "Hälsosam snabbmat.",
      keywordLabel: "En ny kategori · Plantprotein · 5 minuter",
      intro: "PLÄNTLY skriver om reglerna för snabbmat. Riktiga måltider, 20g plantprotein, klart på tiden det tar att koka vatten.",
      sections: [
        {
          heading: "Snabbmat. Omskriven.",
          body: [
            "Snabbmat var aldrig problemet. Kompromissen var det. PLÄNTLY-måltider är klara på 5 minuter — samma tid som vilken snabbmat som helst — men med 20g protein, riktiga ingredienser och noll ånger.",
          ],
        },
        {
          heading: "20g protein. 5 minuter. Ingen kompromiss.",
          body: [
            "Varje PLÄNTLY-måltid är byggd kring en regel: den ska vara lika snabb som snabbmat och lika bra som en riktig måltid. Utvecklat i Sverige. Hantverk från Italien.",
          ],
        },
        {
          heading: "Framtidens bekvämlighetsmat.",
          body: [
            "Bekvämlighet och näring har alltid bytts mot varandra. Vi avslutade det bytet. PLÄNTLY är hälsosam snabbmat — inte en kompromiss mellan de två.",
          ],
        },
      ],
      benefits: [
        { title: "20g plantprotein", desc: "Komplett aminosyraprofil i varje måltid." },
        { title: "Klar på 5 minuter", desc: "Tillsätt bara hett vatten. Riktig mat, ingen väntan." },
        { title: "Utvecklat i Sverige", desc: "Konstruerat enligt skandinavisk näringsstandard." },
        { title: "Hantverk från Italien", desc: "Tillverkat med italienska producenter som ser mat som hantverk." },
      ],
      quickAnswer: {
        title: "Kort svar",
        body: "PLÄNTLY är nyttig snabbmat i en kopp: pasta, baljväxter, grönsaker och kryddor med 20g växtprotein, klart på 5 minuter med kokande vatten. Lika snabbt som en lunch på stan, men du kan läsa varje ingrediens. Två smaker är veganska (Fusilli Bolognese, Smoky BBQ Lentils) och två är vegetariska med mjölkprotein (Pasta Carbonara, Yellow Curry & Rice).",
        links: [
          { label: "Se våra proteinkoppar", path: "/products" },
          { label: "Proteinrika måltider", path: "/proteinrika-maltider" },
          { label: "Plantbaserade måltider", path: "/plantbaserade-maltider" },
        ],
      },
      faqs: [
        { q: "Är nyttig snabbmat dyrare än vanlig snabbmat?", a: "Per måltid är det oftast billigare än att äta ute. En PLÄNTLY-kopp kostar 39 kr, medan en lunch på stan i Sverige normalt kostar 110–160 kr. Jämfört med att laga en större sats hemma är det dyrare — du betalar för tiden du sparar." },
        { q: "Vad är skillnaden mellan nyttig snabbmat och vanlig färdigmat?", a: "Framför allt ingredienslistan och vad måltiden faktiskt ger. Mycket färdigmat är byggd för hållbarhet och låg kostnad, med högt salt och lite fiber. PLÄNTLY är byggd kring 20g protein och 5–9g fiber utan konstgjorda tillsatser — och vi publicerar siffrorna istället för att gömma oss bakom långa tillsatslistor." },
        { q: "Håller sig instant-måltider länge?", a: "Ja. Eftersom PLÄNTLY-kopparna är torra håller de i månader i rumstemperatur — bäst före-datum står på varje kopp. Inget kylskåp, ingen frys, vilket är precis därför de fungerar i skrivbordslådan eller gympaväskan." },
        { q: "Är torrvaror med tillsatt vatten nyttigt?", a: "Torkning är bara borttagning av vatten — det gör inte maten onyttig i sig. Det som avgör är vad som torkats: våra koppar innehåller durumpasta, baljväxter, grönsaker, örter och kryddor. Tillsätt kokande vatten så får du tillbaka måltiden, inte en pulvershake." },
      ],

      ctaHeadline: "Framtidens snabbmat. Idag.",
      ctaText: "Handla måltider",
      related: relatedSv("healthy-fast-food"),
    },
  },
  "protein-cups": {
    en: {
      slug: "protein-cups",
      breadcrumbName: "Protein Cups",
      metaTitle: "Protein Cups | 20g Protein Instant Meals | PLÄNTLY",
      metaDescription: "PLÄNTLY Protein Cups — 20g plant protein per cup, ready in 5 minutes. The smartest protein meal you can keep in your desk drawer, gym bag or kitchen.",
      h1: "Protein Cups.",
      keywordLabel: "Protein cup · 20g protein · Add water",
      intro: "Add hot water. Wait 5 minutes. A proper meal with 20g of plant protein — the cup format built for your real life.",
      sections: [
        {
          heading: "Add water. Wait 5 minutes. 20g protein.",
          body: [
            "The PLÄNTLY Protein Cup was designed around one insight: great food should not require time, equipment, or planning. Add hot water. Wait 5 minutes. A proper meal with 20g of plant protein.",
          ],
        },
        {
          heading: "Keep one everywhere.",
          body: [
            "Desk drawer. Gym bag. Car. Kitchen cabinet. The PLÄNTLY Protein Cup is built for your life — not the life you planned, but the one you actually live.",
          ],
        },
        {
          heading: "Four meals. One format.",
          body: [
            "Fusilli Bolognese, Pasta Carbonara, Yellow Curry with Rice, and Smokey Lentils — each cup delivers 20g of plant protein and is portion-controlled, calorie-balanced and shelf-stable.",
          ],
        },
        {
          heading: "The Starter Pack.",
          body: [
            "New to PLÄNTLY? The Starter Pack lets you try every flavour — enough to find your favourite, and enough to make 20g protein the easiest decision of your week.",
          ],
        },
      ],
      benefits: [
        { title: "20g protein per cup", desc: "Complete amino acid profile from plant sources." },
        { title: "Ready in 5 minutes", desc: "Hot water is the only equipment required." },
        { title: "Four flavours", desc: "Bolognese, Carbonara, Yellow Curry, Smokey Lentils." },
        { title: "Shelf-stable", desc: "Stash in your desk, gym bag or pantry." },
      ],
      faqs: [
        { q: "What is a PLÄNTLY Protein Cup?", a: "A PLÄNTLY Protein Cup is an instant meal cup containing 20g of plant protein, ready in 5 minutes with just hot water. Available in four flavours: Fusilli Bolognese, Pasta Carbonara, Yellow Curry with Rice, and Smokey Lentils." },
        { q: "How do you prepare a PLÄNTLY Protein Cup?", a: "Add hot water to the fill line, stir, wait 5 minutes, eat. No cooking required, no prep, no equipment beyond hot water." },
        { q: "Where can I buy PLÄNTLY Protein Cups?", a: "PLÄNTLY Protein Cups are available online at plaently.com. A Starter Pack is available to try every flavour at once." },
        { q: "How long do PLÄNTLY Protein Cups last?", a: "PLÄNTLY Protein Cups have a long shelf life, making them ideal for desk drawers, gym bags, and pantry storage. Check individual packaging for best-before dates." },
      ],
      ctaHeadline: "20g protein in a cup. Anywhere.",
      ctaText: "Shop the Starter Pack",
      related: relatedEn("protein-cups"),
    },
    sv: {
      slug: "proteinkoppar",
      breadcrumbName: "Proteinkoppar",
      metaTitle: "Proteinkoppar | 20g protein i en kopp | PLÄNTLY",
      metaDescription: "PLÄNTLY Proteinkoppar — 20g plantprotein per kopp, klart på 5 minuter. Den smartaste proteinmåltiden för skrivbordet, gympaväskan eller köket.",
      h1: "Proteinkoppar.",
      keywordLabel: "Proteinkopp · 20g protein · Häll i vatten",
      intro: "Häll i hett vatten. Vänta 5 minuter. En riktig måltid med 20g plantprotein — kopp-formatet byggt för ditt verkliga liv.",
      sections: [
        {
          heading: "Häll i vatten. Vänta 5 minuter. 20g protein.",
          body: [
            "PLÄNTLY Proteinkopp är designad kring en insikt: bra mat ska inte kräva tid, utrustning eller planering. Häll i hett vatten. Vänta 5 minuter. En riktig måltid med 20g plantprotein.",
          ],
        },
        {
          heading: "Ha en överallt.",
          body: [
            "Skrivbordslådan. Gympaväskan. Bilen. Köksskåpet. PLÄNTLY Proteinkopp är byggd för ditt liv — inte det du planerade, utan det du faktiskt lever.",
          ],
        },
        {
          heading: "Fyra måltider. Ett format.",
          body: [
            "Fusilli Bolognese, Pasta Carbonara, Gul Curry med Ris och Smokey Lentils — varje kopp levererar 20g plantprotein och är portionskontrollerad, kaloribalanserad och hållbar i hyllan.",
          ],
        },
        {
          heading: "Starter Pack.",
          body: [
            "Ny till PLÄNTLY? Med Starter Pack provar du alla smaker — tillräckligt för att hitta din favorit och göra 20g protein till veckans enklaste beslut.",
          ],
        },
      ],
      benefits: [
        { title: "20g protein per kopp", desc: "Komplett aminosyraprofil från plantkällor." },
        { title: "Klart på 5 minuter", desc: "Hett vatten är all utrustning du behöver." },
        { title: "Fyra smaker", desc: "Bolognese, Carbonara, Gul Curry, Smokey Lentils." },
        { title: "Hållbar i hyllan", desc: "Förvara i skrivbordet, gympaväskan eller skafferiet." },
      ],
      faqs: [
        { q: "Vad är en PLÄNTLY Proteinkopp?", a: "En PLÄNTLY Proteinkopp är en färdig måltid i kopp med 20g plantprotein, klar på 5 minuter med bara hett vatten. Finns i fyra smaker: Fusilli Bolognese, Pasta Carbonara, Gul Curry med Ris och Smokey Lentils." },
        { q: "Hur tillagar man en PLÄNTLY Proteinkopp?", a: "Häll hett vatten upp till markeringen, rör om, vänta 5 minuter, ät. Ingen matlagning krävs, ingen förberedelse, ingen utrustning utöver hett vatten." },
        { q: "Var kan jag köpa PLÄNTLY Proteinkoppar?", a: "PLÄNTLY Proteinkoppar finns online på plaently.com. Vårt Starter Pack låter dig prova alla smaker på en gång." },
        { q: "Hur länge håller PLÄNTLY Proteinkoppar?", a: "PLÄNTLY Proteinkoppar har lång hållbarhet — perfekt för skrivbordslådan, gympaväskan och skafferiet. Se förpackningen för bäst-före-datum." },
      ],
      ctaHeadline: "20g protein i en kopp. Var som helst.",
      ctaText: "Handla Starter Pack",
      related: relatedSv("protein-cups"),
    },
  },
};

export const getCategoryContent = (key: CategoryKey, lang: Lang): CategoryContent => content[key][lang];
export type { CategoryKey };
