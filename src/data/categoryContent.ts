import type { Lang } from "@/lib/i18n";

export interface CategorySection {
  heading: string;
  body: string[];
}

export interface CategoryContent {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: CategorySection[];
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  ctaHeadline: string;
  ctaText: string;
  keywordLabel: string;
}

type CategoryKey = "high-protein-meals" | "plant-based-meals" | "healthy-instant-meals";

const content: Record<CategoryKey, Record<Lang, CategoryContent>> = {
  "high-protein-meals": {
    en: {
      slug: "high-protein-meals",
      metaTitle: "High Protein Vegan Meals — 20g Plant Protein in 5 Min | PLÄNTLY",
      metaDescription: "High protein vegan meals ready in 5 minutes. 20g complete plant protein per serving — for athletes, professionals and busy modern lifestyles.",
      h1: "High Protein Vegan Meals",
      keywordLabel: "High protein · Plant-based · Ready in 5 min",
      intro:
        "PLÄNTLY high protein meals deliver 20g of complete plant protein in every cup — ready in the time it takes to boil water. Real food, real protein, no compromise.",
      sections: [
        {
          heading: "Why high protein matters",
          body: [
            "Protein is the single most important macronutrient for muscle repair, satiety and stable energy. Most fast food fails on all three. PLÄNTLY was built to fix that — without forcing you to spend an hour in the kitchen.",
            "Each PLÄNTLY meal is engineered to hit 20g of complete plant protein from a blend of pea, soy and rice — a combination that matches whey on amino acid score and bioavailability. You get the muscle-building benefit of animal protein, with the lighter digestion of plants.",
          ],
        },
        {
          heading: "Built for active lifestyles",
          body: [
            "Whether you train five times a week or simply want to stay sharp through long workdays, your body needs consistent protein intake. Skipping meals or relying on processed snacks puts you in an energy and recovery deficit.",
            "PLÄNTLY high protein meals fit into any routine: post-workout refuel, desk lunch, late-night dinner. Just add hot water, wait 5 minutes, and you have a balanced meal — not a shake, not a bar, but actual food.",
          ],
        },
        {
          heading: "Complete plant protein, complete nutrition",
          body: [
            "Beyond protein, every meal includes slow-release carbohydrates, healthy fats from olive oil and nuts, and 5–9g of gut-friendly fibre. The result is steady energy without the post-lunch crash.",
            "We use real ingredients you can pronounce — lentils, pasta, vegetables, herbs, spices. No artificial flavours, no fillers, no compromise on taste.",
          ],
        },
        {
          heading: "Our high protein meals",
          body: [
            "Choose from four signature recipes — Plant-Based Bolognese, Carbonara, Yellow Curry with Rice, and Smokey Lentils. Each cup is portion-controlled, calorie-balanced and shelf-stable, so you can stock your desk, gym bag or pantry with confidence.",
          ],
        },
      ],
      benefits: [
        { title: "20g plant protein", desc: "Complete amino acid profile from pea, soy and rice." },
        { title: "Ready in 5 minutes", desc: "Just add hot water — real food, no waiting." },
        { title: "Balanced macros", desc: "Slow carbs, healthy fats and fibre in every meal." },
        { title: "100% plant-based", desc: "No animal products, no artificial additives." },
      ],
      faqs: [
        { q: "Is plant protein as good as whey?", a: "Yes. Our pea, soy and rice blend matches whey on amino acid score and bioavailability — with easier digestion and zero dairy." },
        { q: "How much protein per serving?", a: "Every PLÄNTLY meal contains 20g of complete plant protein per serving." },
        { q: "Are these meals suitable post-workout?", a: "Absolutely. The 20g protein hit plus balanced carbs make them ideal for muscle recovery within 30–60 minutes of training." },
      ],
      ctaHeadline: "Try high protein meals today",
      ctaText: "Shop now",
    },
    sv: {
      slug: "high-protein-meals",
      metaTitle: "​Protein Måltider — 20g växtprotein på 5 min | PLÄNTLY",
      metaDescription: "​Protein Måltider klara på 5 minuter. 20g komplett växtprotein per portion — för atleter, yrkesverksamma och moderna livsstilar.",
      h1: "​Protein Måltider",
      keywordLabel: "Högprotein · Växtbaserat · Klart på 5 min",
      intro:
        "PLÄNTLY högprotein-måltider levererar 20g komplett växtprotein i varje kopp — klara på tiden det tar att koka vatten. Riktig mat, riktigt protein, inga kompromisser.",
      sections: [
        {
          heading: "Varför högt protein spelar roll",
          body: [
            "Protein är det enskilt viktigaste makronäringsämnet för muskelreparation, mättnad och stabil energi. Det mesta av snabbmaten misslyckas på alla tre punkter. PLÄNTLY byggdes för att lösa det — utan att tvinga dig att stå en timme i köket.",
            "Varje PLÄNTLY-måltid är designad för att leverera 20g komplett växtprotein från en blandning av ärt, soja och ris — en kombination som matchar vassle på aminosyraprofil och biotillgänglighet. Du får den muskeluppbyggande effekten med plantans lättare matsmältning.",
          ],
        },
        {
          heading: "Byggd för aktiva livsstilar",
          body: [
            "Oavsett om du tränar fem gånger i veckan eller bara vill hålla skärpan genom långa arbetsdagar behöver kroppen ett jämnt proteinintag. Att hoppa över måltider eller förlita sig på processade snacks skapar både energi- och återhämtningsbrist.",
            "PLÄNTLY högprotein-måltider passar i alla rutiner: efter träning, lunch vid skrivbordet, sen middag. Tillsätt bara hett vatten, vänta 5 minuter och du har en balanserad måltid — inte en shake eller bar, utan riktig mat.",
          ],
        },
        {
          heading: "Komplett växtprotein, komplett näring",
          body: [
            "Utöver protein innehåller varje måltid långsamma kolhydrater, hälsosamma fetter från olivolja och nötter, och 5–9g tarmvänlig fiber. Resultatet är jämn energi utan dipp efter lunch.",
            "Vi använder riktiga ingredienser du kan uttala — linser, pasta, grönsaker, örter, kryddor. Inga konstgjorda smaker, inga fyllmedel, ingen kompromiss med smaken.",
          ],
        },
        {
          heading: "Våra högprotein-måltider",
          body: [
            "Välj mellan fyra signaturrecept — Växtbaserad Bolognese, Carbonara, Gul Curry med Ris och Smokey Lentils. Varje kopp är portionskontrollerad, kaloribalanserad och hållbar — så du kan fylla på skrivbord, gympaväska eller skafferi med säkerhet.",
          ],
        },
      ],
      benefits: [
        { title: "20g växtprotein", desc: "Komplett aminosyraprofil från ärt, soja och ris." },
        { title: "Klart på 5 minuter", desc: "Tillsätt bara hett vatten — riktig mat, ingen väntan." },
        { title: "Balanserade makron", desc: "Långsamma kolhydrater, hälsosamma fetter och fiber." },
        { title: "100% växtbaserat", desc: "Inga animaliska produkter, inga konstgjorda tillsatser." },
      ],
      faqs: [
        { q: "Är växtprotein lika bra som vassle?", a: "Ja. Vår blandning av ärt, soja och ris matchar vassle på aminosyrapoäng och biotillgänglighet — med lättare matsmältning och utan mejeri." },
        { q: "Hur mycket protein per portion?", a: "Varje PLÄNTLY-måltid innehåller 20g komplett växtprotein per portion." },
        { q: "Passar måltiderna efter träning?", a: "Absolut. 20g protein plus balanserade kolhydrater gör dem perfekta för muskelåterhämtning inom 30–60 minuter efter passet." },
      ],
      ctaHeadline: "Prova högprotein-måltider idag",
      ctaText: "Handla nu",
    },
  },
  "plant-based-meals": {
    en: {
      slug: "plant-based-meals",
      metaTitle: "Plant-Based Ready Meals — Real Food in 5 Minutes | PLÄNTLY",
      metaDescription: "Plant-based ready meals with 20g protein, balanced macros and real ingredients. The healthy fast food alternative for modern lifestyles.",
      h1: "Plant-Based Ready Meals",
      keywordLabel: "Plant-based · Real food · Sustainable",
      intro:
        "PLÄNTLY plant-based ready meals are real food, made from real plants — engineered for the moments when convenience matters most.",
      sections: [
        {
          heading: "What 'plant-based' really means",
          body: [
            "Plant-based isn't a label — it's a standard. PLÄNTLY uses 100% plant ingredients: lentils, pulses, vegetables, whole grains, olive oil, herbs and spices. No animal products, no hidden fillers, no compromise.",
            "We believe plant-based meals should taste better than the alternatives, not worse. That's why every recipe goes through dozens of iterations with our chefs before it ever reaches a cup.",
          ],
        },
        {
          heading: "Better for you, better for the planet",
          body: [
            "A plant-based meal uses up to 90% less water and produces a fraction of the CO₂ emissions of a comparable meat meal. Choosing PLÄNTLY for one lunch a week meaningfully reduces your environmental footprint.",
            "But sustainability shouldn't be a sacrifice. Our meals are designed to deliver more nutrition per calorie than typical fast food — more protein, more fibre, more micronutrients.",
          ],
        },
        {
          heading: "Convenience without compromise",
          body: [
            "The biggest barrier to eating well isn't motivation — it's time. PLÄNTLY closes that gap. Cup, hot water, 5 minutes. That's the entire process.",
            "Stash a few cups at your desk, in your gym bag, or at home. When hunger strikes, you have a real meal ready — not a granola bar, not takeaway, not skipping lunch again.",
          ],
        },
        {
          heading: "From our kitchen to yours",
          body: [
            "Our four signature meals — Bolognese, Carbonara, Yellow Curry with Rice, and Smokey Lentils — were developed by our team in Stockholm to deliver craveable flavour with serious nutrition.",
            "Each cup is shelf-stable, portable and recyclable. No fridge, no freezer, no fuss.",
          ],
        },
      ],
      benefits: [
        { title: "100% plant-based", desc: "Real plants, real food, no animal products." },
        { title: "Lower footprint", desc: "Up to 90% less water than comparable meat meals." },
        { title: "Shelf-stable", desc: "No fridge or freezer needed — store anywhere." },
        { title: "Recyclable packaging", desc: "Designed with sustainability in mind." },
      ],
      faqs: [
        { q: "Are PLÄNTLY meals 100% vegan?", a: "Yes — all PLÄNTLY meals are 100% plant-based with no animal-derived ingredients." },
        { q: "Do they need refrigeration?", a: "No. Our cups are shelf-stable for months — perfect for desks, pantries and travel." },
        { q: "Is the packaging recyclable?", a: "Yes, our cups are designed to be recyclable in standard household streams." },
      ],
      ctaHeadline: "Switch to plant-based",
      ctaText: "Shop now",
    },
    sv: {
      slug: "plant-based-meals",
      metaTitle: "Växtbaserade färdigrätter — riktig mat på 5 minuter | PLÄNTLY",
      metaDescription: "Växtbaserade färdigrätter med 20g protein, balanserade makron och riktiga ingredienser. Det hälsosamma snabbmatsalternativet för moderna livsstilar.",
      h1: "Växtbaserade färdigrätter",
      keywordLabel: "Växtbaserat · Riktig mat · Hållbart",
      intro:
        "PLÄNTLY växtbaserade färdigrätter är riktig mat, gjord av riktiga växter — utvecklad för de stunder då bekvämligheten betyder mest.",
      sections: [
        {
          heading: "Vad 'växtbaserat' verkligen betyder",
          body: [
            "Växtbaserat är inte en etikett — det är en standard. PLÄNTLY använder 100% växtbaserade ingredienser: linser, baljväxter, grönsaker, fullkorn, olivolja, örter och kryddor. Inga animaliska produkter, inga dolda fyllmedel, inga kompromisser.",
            "Vi tror att växtbaserade måltider ska smaka bättre än alternativen — inte sämre. Därför går varje recept genom dussintals iterationer med våra kockar innan det ens når en kopp.",
          ],
        },
        {
          heading: "Bättre för dig, bättre för planeten",
          body: [
            "En växtbaserad måltid använder upp till 90% mindre vatten och ger en bråkdel av CO₂-utsläppen jämfört med en motsvarande köttmåltid. Att välja PLÄNTLY till en lunch i veckan minskar din miljöpåverkan på riktigt.",
            "Men hållbarhet ska inte vara en uppoffring. Våra måltider är designade för att leverera mer näring per kalori än vanlig snabbmat — mer protein, mer fiber, mer mikronäringsämnen.",
          ],
        },
        {
          heading: "Bekvämlighet utan kompromiss",
          body: [
            "Det största hindret för att äta bra är inte motivation — det är tid. PLÄNTLY täpper till det gapet. Kopp, hett vatten, 5 minuter. Det är hela processen.",
            "Förvara några koppar vid skrivbordet, i gympaväskan eller hemma. När hungern slår till har du en riktig måltid redo — ingen müslibar, ingen takeaway, ingen utebliven lunch igen.",
          ],
        },
        {
          heading: "Från vårt kök till ditt",
          body: [
            "Våra fyra signaturmåltider — Bolognese, Carbonara, Gul Curry med Ris och Smokey Lentils — utvecklades av vårt team i Stockholm för att leverera smak du längtar efter, med seriös näring.",
            "Varje kopp är hållbar, portabel och återvinningsbar. Inget kylskåp, ingen frys, inget krångel.",
          ],
        },
      ],
      benefits: [
        { title: "100% växtbaserat", desc: "Riktiga växter, riktig mat, inga animaliska produkter." },
        { title: "Lägre miljöavtryck", desc: "Upp till 90% mindre vatten än motsvarande köttmåltider." },
        { title: "Hållbart i hyllan", desc: "Inget kylskåp eller frys behövs — förvara var som helst." },
        { title: "Återvinningsbar förpackning", desc: "Designad med hållbarhet i åtanke." },
      ],
      faqs: [
        { q: "Är PLÄNTLY-måltider 100% veganska?", a: "Ja — alla PLÄNTLY-måltider är 100% växtbaserade utan animaliska ingredienser." },
        { q: "Behöver de kylas?", a: "Nej. Våra koppar är hållbara i månader — perfekt för skrivbord, skafferi och resor." },
        { q: "Är förpackningen återvinningsbar?", a: "Ja, våra koppar är designade för att kunna återvinnas i vanlig hushållssortering." },
      ],
      ctaHeadline: "Byt till växtbaserat",
      ctaText: "Handla nu",
    },
  },
  "healthy-instant-meals": {
    en: {
      slug: "healthy-instant-meals",
      metaTitle: "Healthy Instant Meals — Real Food, Ready in 5 Min | PLÄNTLY",
      metaDescription: "Healthy instant meals with 20g plant protein and balanced nutrition. The smart alternative to instant noodles and processed fast food.",
      h1: "Healthy Instant Meals",
      keywordLabel: "Instant · Healthy · Real ingredients",
      intro:
        "PLÄNTLY proves that 'instant' and 'healthy' belong in the same sentence. Real ingredients, 20g of plant protein, ready in 5 minutes.",
      sections: [
        {
          heading: "The instant food problem — solved",
          body: [
            "For decades, instant meals meant a trade-off: speed in exchange for sodium bombs, refined carbs and zero protein. The category got faster, but it never got better.",
            "PLÄNTLY rebuilds the instant meal from scratch. Same convenience, completely different nutrition profile. 20g of complete plant protein, balanced macros, real ingredients — all in the time it takes to boil a kettle.",
          ],
        },
        {
          heading: "Healthy fast food, finally",
          body: [
            "Most fast food forces you to choose between speed, taste and nutrition. PLÄNTLY refuses that trade-off. Our meals are designed to deliver all three — without packaged shortcuts that compromise quality.",
            "Whether you're working late, between meetings, or hungry after a workout, you shouldn't have to settle for something that leaves you sluggish. PLÄNTLY keeps you fuelled and focused.",
          ],
        },
        {
          heading: "Perfect for the modern day",
          body: [
            "Office desks, hotel rooms, university dorms, gym bags — PLÄNTLY fits anywhere a kettle does. No kitchen, no cooking skills, no shopping trips. Just real food when you need it.",
            "We hear the same story from athletes, entrepreneurs, parents and students: PLÄNTLY is the meal they reach for when they don't want to compromise on health or time.",
          ],
        },
        {
          heading: "Try the healthy instant meal",
          body: [
            "Start with our 12-meal Starter Pack and try all four flavours. Most people find a favourite within the first week — and never go back to instant noodles.",
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
      ctaHeadline: "Try healthy instant meals",
      ctaText: "Shop now",
    },
    sv: {
      slug: "healthy-instant-meals",
      metaTitle: "Hälsosamma snabbmåltider — riktig mat på 5 min | PLÄNTLY",
      metaDescription: "Hälsosamma snabbmåltider med 20g växtprotein och balanserad näring. Det smarta alternativet till snabbnudlar och processad snabbmat.",
      h1: "Hälsosamma snabbmåltider",
      keywordLabel: "Snabb · Hälsosam · Riktiga ingredienser",
      intro:
        "PLÄNTLY bevisar att 'snabb' och 'hälsosam' hör hemma i samma mening. Riktiga ingredienser, 20g växtprotein, klart på 5 minuter.",
      sections: [
        {
          heading: "Snabbmatsproblemet — löst",
          body: [
            "I årtionden har snabbmåltider betytt en kompromiss: hastighet i utbyte mot saltbomber, raffinerade kolhydrater och noll protein. Kategorin blev snabbare men aldrig bättre.",
            "PLÄNTLY bygger om snabbmåltiden från grunden. Samma bekvämlighet, helt annan näringsprofil. 20g komplett växtprotein, balanserade makron, riktiga ingredienser — allt på tiden det tar att koka en kanna vatten.",
          ],
        },
        {
          heading: "Hälsosam snabbmat, äntligen",
          body: [
            "Det mesta av snabbmaten tvingar dig att välja mellan hastighet, smak och näring. PLÄNTLY vägrar den kompromissen. Våra måltider är designade att leverera alla tre — utan genvägar som sänker kvaliteten.",
            "Oavsett om du jobbar sent, är mellan möten eller hungrig efter träning ska du inte behöva nöja dig med något som gör dig trög. PLÄNTLY håller dig mätt och fokuserad.",
          ],
        },
        {
          heading: "Perfekt för det moderna livet",
          body: [
            "Kontorsskrivbord, hotellrum, studentkorridorer, gympaväskor — PLÄNTLY passar överallt där en vattenkokare passar. Inget kök, inga matlagningskunskaper, ingen butiksrunda. Bara riktig mat när du behöver den.",
            "Vi hör samma historia från atleter, entreprenörer, föräldrar och studenter: PLÄNTLY är måltiden de greppar efter när de inte vill kompromissa med hälsa eller tid.",
          ],
        },
        {
          heading: "Prova den hälsosamma snabbmåltiden",
          body: [
            "Börja med vårt 12-måltiders Starter Pack och prova alla fyra smakerna. De flesta hittar en favorit inom första veckan — och går aldrig tillbaka till snabbnudlar.",
          ],
        },
      ],
      benefits: [
        { title: "Riktiga ingredienser", desc: "Inga fyllmedel, inga konstgjorda smaker, inga genvägar." },
        { title: "5 minuters tillagning", desc: "Tillsätt bara hett vatten — vattenkokaren är allt du behöver." },
        { title: "20g växtprotein", desc: "Mer protein än de flesta måltider lagade från grunden." },
        { title: "Portabel", desc: "Ta med den var som helst — skrivbord, gym, resa, hemma." },
      ],
      faqs: [
        { q: "Hur skiljer sig detta från snabbnudlar?", a: "PLÄNTLY innehåller riktiga ingredienser, 20g växtprotein, balanserade makron och noll konstgjorda fyllmedel — snabbnudlar erbjuder inget av detta." },
        { q: "Hur lång tid tar det att tillaga?", a: "5 minuter. Tillsätt hett vatten, rör om, vänta, ät." },
        { q: "Behöver jag något annat än vatten?", a: "Bara en kopp kokande vatten — det är allt. Ingen matlagning, ingen mikro, inga extra ingredienser." },
      ],
      ctaHeadline: "Prova hälsosamma snabbmåltider",
      ctaText: "Handla nu",
    },
  },
};

export const getCategoryContent = (key: CategoryKey, lang: Lang): CategoryContent => content[key][lang];
export type { CategoryKey };