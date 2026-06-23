import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Lang = "sv" | "en";

interface LangStore {
 lang: Lang;
 setLang: (lang: Lang) => void;
 t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
 // Nav
 "nav.home": { sv: "Hem", en: "Home" },
 "nav.products": { sv: "Produkter", en: "Products" },
 "nav.howItWorks": { sv: "Så funkar det", en: "How it works" },
 "nav.nutrition": { sv: "Näring", en: "Nutrition" },
 "nav.lifestyle": { sv: "Livsstil", en: "Lifestyle" },
 "nav.about": { sv: "Om oss", en: "About" },
 "nav.blog": { sv: "Blogg", en: "Blog" },
 "nav.faq": { sv: "FAQ", en: "FAQ" },
 "nav.contact": { sv: "Kontakt", en: "Contact" },
 "nav.shopNow": { sv: "Handla nu", en: "Shop now" },

 // Hero
 "hero.headline": { sv: "Hälsosam snabbmat.", en: "Healthy Fast Food." },
 "hero.subheadline": { sv: "20g plantbaserad protein. Klart på 5 minuter.\nUtvecklat i Sverige, hantverk från Italien.", en: "20g plant protein. Ready in 5 minutes.\nDeveloped in Sweden, crafted in Italy." },
 "hero.cta": { sv: "Handla Måltider", en: "Shop Meals" },
 "hero.howItWorks": { sv: "Så funkar det", en: "How it works" },
 "hero.ctaStarter": { sv: "Handla Starter Pack", en: "Shop Starter Pack" },
 "hero.ctaTry": { sv: "Prova PLÄNTLY", en: "Try PLÄNTLY" },
 "hero.badge1": { sv: "20g protein", en: "20g protein" },
 "hero.badge2": { sv: "Klart på 5 min", en: "Ready in 5 min" },
 "hero.badge3": { sv: "100% plantbaserat", en: "100% plant-based" },

 // Problem → Solution
 "ps.eyebrow": { sv: "Problem → Lösning", en: "Problem → Solution" },
 "ps.problemTitle": { sv: "Snabbmat är ohälsosamt.", en: "Fast food is unhealthy." },
 "ps.problemDesc": { sv: "Hälsosam mat tar tid du inte har.\n\n", en: "Healthy food takes time you don't have." },
 "ps.solutionTitle": { sv: "PLÄNTLY = hälsosam snabbmat.", en: "PLÄNTLY = healthy fast food." },
 "ps.solutionDesc": { sv: "Riktiga måltider med 20g plantprotein. Klara på 5 minuter.", en: "Real meals with 20g plant protein. Ready in 5 minutes." },

 // Starter Pack highlight
 "starter.badge": { sv: "Begränsat erbjudande", en: "Limited offer" },
 "starter.title": { sv: "Starter Pack", en: "Starter Pack" },
 "starter.subtitle": { sv: "Den perfekta introduktionen till PLÄNTLY.", en: "The perfect introduction to PLÄNTLY." },
 "starter.meals": { sv: "12 måltider", en: "12 meals" },
 "starter.cookTime": { sv: "Tillagad på 5 min", en: "Ready in 5 minutes" },
 "starter.freeShipping": { sv: "Fri frakt på beställningar över 499 kr", en: "Free shipping on orders over 499 kr" },
 "starter.protein": { sv: "20g protein per måltid", en: "20g protein per meal" },
 "starter.cta": { sv: "Beställ nu", en: "Order now" },
 "starter.from": { sv: "Från", en: "From" },

 // Trust
 "trust.rating": { sv: "4.8/5 från 500 + recensioner", en: "4.8/5 from 500+ reviews" },
 "trust.loved": { sv: "Älskad av yrkesverksamma, atleter och moderna arbetsplatser.", en: "Loved by professionals, athletes and modern workplaces." },
 "trust.offices": { sv: "Kontor", en: "Offices" },
 "trust.athletes": { sv: "Atleter", en: "Athletes" },
 "trust.entrepreneurs": { sv: "Entreprenörer", en: "Entrepreneurs" },
 "trust.students": { sv: "Studenter", en: "Students" },
 "trust.professionals": { sv: "Yrkesverksamma", en: "Professionals" },

 // Why
 "why.title": { sv: "Varför PLÄNTLY?", en: "Why PLÄNTLY?" },
 "why.subtitle": { sv: "Allt du behöver i en måltid. Inget du inte behöver.", en: "Everything you need in a meal. Nothing you don't." },
 "why.highProtein": { sv: "Protein måltider", en: "High Protein" },
 "why.highProteinDesc": { sv: "20g plantprotein per portion", en: "20g plant protein per serving" },
 "why.plantBased": { sv: "Plantbaserat", en: "Plant-Based" },
 "why.plantBasedDesc": { sv: "100% plantbaserad protein", en: "100% plant-based protein" },
 "why.lowSugar": { sv: "Lågt socker", en: "Low Sugar" },
 "why.lowSugarDesc": { sv: "Vissa tillsatta sockerarter eller sötningsmedel", en: "Some added sugars or sweeteners" },
 "why.readyInMinutes": { sv: "Klart på minuter", en: "Ready in Minutes" },
 "why.readyInMinutesDesc": { sv: "Tillsätt bara hett vatten och njut", en: "Just add hot water and enjoy" },
 "why.sustainable": { sv: "Hållbart", en: "Sustainable" },
 "why.sustainableDesc": { sv: "Miljövänliga ingredienser & förpackningar", en: "Eco-friendly ingredients & packaging" },
 "why.balanced": { sv: "Balanserad näring", en: "Balanced Nutrition" },
 "why.balancedDesc": { sv: "Optimerade makron för varje måltid", en: "Optimized macros for every meal" },

 // How it works
 "how.title": { sv: "Så funkar det", en: "How it works" },
 "how.subtitle": { sv: "Tre enkla steg till riktig näring.", en: "Three simple steps to real nutrition." },
 "how.step1Title": { sv: "Välj dina måltider", en: "Choose your meals" },
 "how.step1Desc": { sv: "Välj bland våra, protein och fiberrika smaker.", en: "Pick from our protein and fibre-rich flavours." },
 "how.step2Title": { sv: "Tillsätt hett vatten", en: "Add hot water" },
 "how.step2Desc": { sv: "Häll i kokande vatten, rör om och vänta 5 minuter.", en: "Pour in boiling water, stir and wait 5 minutes." },
 "how.step3Title": { sv: "Njut av riktigt protein", en: "Enjoy real protein" },
 "how.step3Desc": { sv: "En komplett, balanserad måltid med 20g plantprotein.", en: "A complete, balanced meal with 20g plant protein." },

 // Lifestyle section
 "lifestyle.title": { sv: "Byggd för det moderna livet", en: "Built for modern life" },
 "lifestyle.subtitle": { sv: "Vart din dag än tar dig — PLÄNTLY passar in.", en: "Wherever your day takes you — PLÄNTLY fits in." },
 "lifestyle.office": { sv: "Kontorsluncher", en: "Office Lunches" },
 "lifestyle.officeDesc": { sv: "Näringsrika måltider vid skrivbordet utan dåligt samvete.", en: "Nutritious desk meals without the guilt." },
 "lifestyle.postWorkout": { sv: "Efter träningen", en: "Post Workout" },
 "lifestyle.postWorkoutDesc": { sv: "Fyll på med 20g plantprotein efter varje pass.", en: "Refuel with 20g plant protein after every session." },
 "lifestyle.travel": { sv: "Resedagar", en: "Travel Days" },
 "lifestyle.travelDesc": { sv: "Lätta, behöver ingen kyl — perfekta måltider för dig som är på språng.", en: "Lightweight, no fridge needed — perfect meals on the go." },
 "lifestyle.dinner": { sv: "Snabb hälsosam middag", en: "Quick Healthy Dinner" },
 "lifestyle.dinnerDesc": { sv: "En riktig middag på 5 minuter, även dina mest hektiska kvällar.", en: "A real dinner in 5 minutes, even on your busiest nights." },

 // Product overview
 "products.title": { sv: "Våra måltider", en: "Our Meals" },
 "products.subtitle": { sv: "Plantbaserade måltider fyllda med protein och fibrer. \nTillsätt bara hett vatten.", en: "Plant-based meals packed with protein and fibre. \nJust add hot water." },
 "products.addToCart": { sv: "Lägg i varukorg", en: "Add to cart" },
 "products.addedToCart": { sv: "Tillagd i varukorgen!", en: "Added to cart!" },

 // Products page
 "products.pageTitle": { sv: "Plantbaserade proteinmåltider", en: "Plant-Based Protein Meals" },
 "products.pageSubtitle": { sv: "Plantbaserade proteinmåltider klar på 5 minuter.\nVälj dina favoriter.", en: "Plant-based protein meals ready in 5 minutes.\nChoose your favourites." },
 "products.noProducts": { sv: "Inga produkter hittades.", en: "No products found." },
 "products.notFound": { sv: "Produkten hittades inte", en: "Product not found" },
 "products.backToProducts": { sv: "Tillbaka till produkter", en: "Back to products" },
 "products.perMeal": { sv: "per måltid", en: "per meal" },

 // Product detail enhancements
 "productDetail.tasteTitle": { sv: "Smaken först", en: "Taste first" },
 "productDetail.tasteDesc": { sv: "Utvecklad av kockar i Stockholm för att leverera riktig, tillfredsställande smak — inte ett kompromissalternativ.", en: "Developed by chefs in Stockholm to deliver real, satisfying flavour — not a compromise option." },
 "productDetail.nutritionTitle": { sv: "Näringshöjdpunkter", en: "Nutrition highlights" },
 "productDetail.nutritionProtein": { sv: "20g plantprotein per portion", en: "20g plant protein per serving" },
 "productDetail.nutritionMacros": { sv: "Balanserade makron och 5–9g fiber", en: "Balanced macros and 5–9g fibre" },
 "productDetail.nutritionClean": { sv: "Riktiga ingredienser, inga konstgjorda tillsatser", en: "Real ingredients, no artificial additives" },
 "productDetail.prepTitle": { sv: "Klart på 5 minuter", en: "Ready in 5 minutes" },
 "productDetail.prepStep1": { sv: "Öppna koppen", en: "Open the cup" },
 "productDetail.prepStep2": { sv: "Tillsätt hett vatten till markeringen", en: "Add hot water to the line" },
 "productDetail.prepStep3": { sv: "Rör om och vänta 5 min", en: "Stir and wait 5 min" },
 "productDetail.benefitsTitle": { sv: "Hälsosam snabbmat", en: "Healthy fast food" },
 "productDetail.benefitsDesc": { sv: "100% plantbaserad protein, balanserade makron och riktiga ingredienser — på tiden det tar att koka vatten.", en: "100% plant-based protein, balanced macros and real ingredients — in the time it takes to boil water." },
 "productDetail.ctaSubscribe": { sv: "Starta prenumeration", en: "Start subscription" },

 // Bundles
 "bundles.title": { sv: "Välj ditt paket", en: "Choose your pack" },
 "bundles.subtitle": { sv: "Spara mer när du köper mer.", en: "Save more when you buy more." },
 "bundles.orderNow": { sv: "Beställ nu", en: "Order now" },
  "bundles.mostPopular": { sv: "Populärast", en: "Most Popular" },
 "bundles.bestValue": { sv: "Bäst värde", en: "Best Value" },
 "bundles.save": { sv: "Spara", en: "Save" },
 "bundles.desc.starter": { sv: "Börja med vårt Starter Pack och prova alla fyra smakerna. De flesta hittar en favorit inom första veckan — och går aldrig tillbaka till snabbnudlar.", en: "Start with our Starter Pack and try all four flavours. Most people find a favourite within the first week — and never go back to instant noodles." },
 "bundles.desc.athlete": { sv: "Vårt mest populära paket. 24 plantbaserade proteinmåltider för din träning. Förstahandsvalet för en aktiv livsstil.", en: "Our most popular pack. 24 high-protein plant-based meals to fuel your training. The go-to choice for active lifestyles." },
 "bundles.desc.office": { sv: "Mat till hela teamet. 48 plantbaserade proteinmåltider — perfekt för kontorsköket. Enkla och hälsosamma luncher.", en: "Feed the whole team. 48 plant-based protein meals — perfect for the office kitchen. Healthy lunches made easy." },
  "bundles.desc.bigoffice": { sv: "Bäst värde. 96 plantbaserade proteinmåltider för störst besparing. Fyll på och ha alltid hemma.", en: "Best value. 96 plant-based protein meals for the biggest savings. Stock up and never run out." },
 "bundles.freeShipping": { sv: "Fri frakt i Sverige", en: "Free shipping in Sweden" },
 "bundles.tryFirst": { sv: "Prova först", en: "Try first" },
 "bundles.youSave": { sv: "Du sparar", en: "You save" },
 "bundles.value": { sv: "Värde", en: "Value" },
 "bundles.perCup": { sv: "kr / kopp", en: "kr / cup" },
 "bundles.cups": { sv: "koppar", en: "cups" },
 "bundles.subSave": { sv: "Prenumerera & Spara", en: "Subscribe & Save" },
 "bundles.feat.allFlavours": { sv: "Alla 4 smaker ingår", en: "All 4 flavours included" },
 "bundles.feat.firstOrder": { sv: "Perfekt som första order", en: "Perfect as first order" },
 "bundles.feat.standardShipping": { sv: "Standardfrakt, 49 SEK", en: "Standard shipping, 49 SEK" },
  "bundles.feat.mix4": { sv: "Mix av alla 4 smaker", en: "Mix of all 4 flavours" },
  "bundles.feat.freeShipSe": { sv: "Fri frakt (Sverige)", en: "Free shipping (Sweden)" },
  "bundles.feat.delivered": { sv: "Levereras inom 1-2 dagar", en: "Delivered in 1-2 days" },
 "bundles.feat.monthlyMix": { sv: "Valfri mix varje månad", en: "Custom mix every month" },
 "bundles.feat.freeShipAlways": { sv: "Fri frakt (Sverige)", en: "Free shipping (Sweden)" },
 "bundles.feat.cancelAnytime": { sv: "Avsluta när som helst", en: "Cancel anytime" },
 "bundles.feat.priorityCs": { sv: "Prioriterad kundservice", en: "Priority customer service" },

 // Mix builder
 "mix.title": { sv: "Anpassa din mix", en: "Customise your mix" },
 "mix.subtitle": { sv: "Justera fördelningen av smaker. Standard är jämn fördelning.", en: "Adjust your flavour split. Defaults to an even mix." },
 "mix.cupsLabel": { sv: "koppar valda", en: "cups selected" },
 "mix.of": { sv: "av", en: "of" },
 "mix.reset": { sv: "Återställ jämn mix", en: "Reset to even mix" },
 "mix.confirm": { sv: "Lägg i kundvagn", en: "Add to cart" },
 "mix.loading": { sv: "Laddar smaker…", en: "Loading flavours…" },
 "mix.tooMany": { sv: "Du har valt fler än paketstorleken.", en: "You've selected more than the pack size." },
 "mix.tooFew": { sv: "Lägg till fler koppar för att fylla paketet.", en: "Add more cups to fill the pack." },
 "mix.flavourCol": { sv: "Smak", en: "Flavour" },

 // Nutrition preview
 "nutrition.title": { sv: "NÄRING SOM FAKTISKT RÄKNAS", en: "NUTRITION THAT ACTUALLY COUNTS" },
 "nutrition.desc": { sv: "Varje PLÄNTLY-måltid är formulerad för att leverera balanserade makronäringsämnen från växtbaserade källor — högt i protein, med kolhydrater och hälsosamma fetter.", en: "Every PLÄNTLY meal is formulated to deliver balanced macronutrients from plant-based sources — high in protein, with carbs and healthy fats." },
 "nutrition.average": { sv: "Genomsnittliga värden per portion. Varierar beroende på smak.", en: "Average values per serving. Varies by flavour." },
 "nutrition.protein": { sv: "Protein", en: "Protein" },
 "nutrition.carbs": { sv: "Kolhydrater", en: "Carbohydrates" },
 "nutrition.fat": { sv: "Fett", en: "Fat" },
 "nutrition.calories": { sv: "Kalorier", en: "Calories" },

 // Nutrition page
 "nutritionPage.title": { sv: "Plantbaserad proteinnäring", en: "Plant-Based Protein Nutrition" },
 "nutritionPage.subtitle": { sv: "Varje PLÄNTLY-måltid är formulerad av nutritionister för att leverera komplett, balanserad näring från 100% plantbaserad protein..", en: "Every PLÄNTLY meal is formulated by nutritionists to deliver complete, balanced nutrition from 100% plant-based protein." },
 "nutritionPage.proteinDesc": { sv: "Komplett aminosyraprofil från ärt- och solrosprotein.", en: "Complete amino acid profile from pea and sunflower protein." },
 "nutritionPage.carbsLabel": { sv: "Kolhydrater", en: "Carbohydrates" },
 "nutritionPage.carbsValue": { sv: "25–37g", en: "25–37g" },
 "nutritionPage.carbsDesc": { sv: "Långsam energifrisättning från ärt - solros protein.", en: "Slow energy release from pea - sunflower protein." },
 "nutritionPage.fatDesc": { sv: "Hälsosamma fetter från olivolja, kokos och nötter.", en: "Healthy fats from olive oil, coconut and nuts." },
 "nutritionPage.fiberLabel": { sv: "Fiber", en: "Fibre" },
 "nutritionPage.fiberValue": { sv: "5–9g", en: "5–9g" },
 "nutritionPage.fiberDesc": { sv: "Tarmvänlig fiber för mättnad och matsmältning.", en: "Gut-friendly fibre for satiety and digestion." },
 "nutritionPage.caloriesDesc": { sv: "Balanserat kaloriinnehåll anpassat för en komplett måltid.", en: "Balanced calorie content designed for a complete meal." },
 "nutritionPage.whyTitle": { sv: "Varför plantprotein?", en: "Why plant protein?" },
 "nutritionPage.whyP1": { sv: "Plantbaserade proteiner erbjuder en komplett aminosyraprofil när de kombineras rätt, samtidigt som de är lättare att smälta och betydligt mer hållbara än animaliska källor.", en: "Plant-based proteins offer a complete amino acid profile when combined correctly, while being easier to digest and significantly more sustainable than animal sources." },
 "nutritionPage.whyP2": { sv: "PLÄNTLY använder en egen blandning av ärt och solros protein för att uppnå ett komplett aminosyravärde som matchar vassleprotein i biotillgänglighet.", en: "PLÄNTLY uses a proprietary blend of pea and sunflower protein to achieve a complete amino acid score matching whey protein in bioavailability." },
 "nutritionPage.whyP3": { sv: "Utöver protein är våra måltider rika på mikronäringsämnen, antioxidanter och fiber — näringsämnen som ofta saknas i processad snabbmat.", en: "Beyond protein, our meals are rich in micronutrients, antioxidants and fibre — nutrients often missing from processed fast food." },
 "nutritionPage.sustainTitle": { sv: "Hållbarhetseffekt", en: "Sustainability Impact" },
 "nutritionPage.co2": { sv: "Mindre CO₂-utsläpp jämfört med köttmåltider", en: "Less CO₂ emissions compared to meat meals" },
 "nutritionPage.water": { sv: "Mindre vattenanvändning per portion", en: "Less water usage per serving" },
 "nutritionPage.land": { sv: "Mindre markanvändning jämfört med animaliskt protein", en: "Less land use compared to animal protein" },

 // Testimonials
 "testimonials.title": { sv: "Vad andra säger", en: "What others say" },

 // Final CTA
 "cta.headline": { sv: "Ät smartare. Lev bättre.", en: "Eat smarter. Live better." },
 "cta.subheadline": { sv: "Gå med tusentals som valt riktiga, plantbaserade proteinmåltider.", en: "Join thousands who chose real, plant-based protein meals." },
 "cta.button": { sv: "Handla PLÄNTLY", en: "Shop PLÄNTLY" },

 // Cart
 "cart.title": { sv: "Varukorg", en: "Cart" },
 "cart.empty": { sv: "Din varukorg är tom", en: "Your cart is empty" },
 "cart.products": { sv: "produkter", en: "products" },
 "cart.product": { sv: "produkt", en: "product" },
 "cart.inCart": { sv: "i din varukorg", en: "in your cart" },
 "cart.total": { sv: "Totalt", en: "Total" },
 "cart.checkout": { sv: "Till kassan", en: "Checkout" },
 "cart.remove": { sv: "Ta bort", en: "Remove" },
 "cart.decrease": { sv: "Minska antal", en: "Decrease quantity" },
 "cart.increase": { sv: "Öka antal", en: "Increase quantity" },

 // Bundles extras
 "bundles.eyebrow": { sv: "Paket", en: "Bundles" },
 "bundles.whatsInside": { sv: "Vad ingår", en: "What's inside" },

 // Footer
 "footer.desc": { sv: "Plantbaserade proteinmåltider för det moderna livet. Skandinavisk enkelhet möter riktig näring.", en: "Plant-based protein meals for modern life. Scandinavian simplicity meets real nutrition." },
 "footer.explore": { sv: "Utforska", en: "Explore" },
 "footer.support": { sv: "Support", en: "Support" },
 "footer.shipping": { sv: "Frakt", en: "Shipping" },
 "footer.privacy": { sv: "Integritetspolicy", en: "Privacy Policy" },
 "footer.terms": { sv: "Villkor", en: "Terms of Service" },
 "footer.stayUpdated": { sv: "Håll dig uppdaterad", en: "Stay updated" },
 "footer.newsletterDesc": { sv: "Få näringstips och exklusiva erbjudanden.", en: "Get nutrition tips and exclusive offers." },
 "footer.emailPlaceholder": { sv: "Din e-post", en: "Your email" },
 "footer.join": { sv: "Gå med", en: "Join" },
 "footer.rights": { sv: "Alla rättigheter förbehållna.", en: "All rights reserved." },
 "footer.highProtein": { sv: "Högprotein", en: "High Protein" },
 "footer.plantBased": { sv: "Plantbaserat", en: "Plant-Based" },
 "footer.instantMeals": { sv: "Snabbmåltider", en: "Instant Meals" },
 "footer.categories": { sv: "Kategorier", en: "Categories" },
 "footer.flavoursPacks": { sv: "Smaker & paket", en: "Flavors & packs" },

 // Header a11y
 "header.switchLang": { sv: "Byt språk", en: "Switch language" },
 "header.openMenu": { sv: "Öppna meny", en: "Open menu" },

 // Reviews
 "reviews.title": { sv: "Kundrecensioner", en: "Customer reviews" },
 "reviews.write": { sv: "Skriv en recension", en: "Write a review" },
 "reviews.cancel": { sv: "Avbryt", en: "Cancel" },
 "reviews.noReviews": { sv: "Inga recensioner ännu — bli först.", en: "No reviews yet — be the first." },
 "reviews.countOne": { sv: "recension", en: "review" },
 "reviews.countMany": { sv: "recensioner", en: "reviews" },
 "reviews.formTitle": { sv: "Recensera", en: "Review" },
 "reviews.labelRating": { sv: "Ditt betyg *", en: "Your rating *" },
 "reviews.labelName": { sv: "Namn *", en: "Name *" },
 "reviews.labelEmail": { sv: "E-post * (publiceras inte)", en: "Email * (not published)" },
 "reviews.labelTitle": { sv: "Rubrik", en: "Title" },
 "reviews.placeholderOptional": { sv: "Valfritt", en: "Optional" },
 "reviews.labelBody": { sv: "Din recension *", en: "Your review *" },
 "reviews.submit": { sv: "Skicka recension", en: "Submit review" },
 "reviews.approvalNote": { sv: "Din recension visas efter admin-godkännande.", en: "Your review will be visible after admin approval." },
 "reviews.submitSuccess": { sv: "Tack! Din recension visas när den godkänts.", en: "Thanks! Your review will appear once approved." },
 "reviews.errNameRequired": { sv: "Namn krävs", en: "Name is required" },
 "reviews.errInvalidEmail": { sv: "Ogiltig e-post", en: "Invalid email" },
 "reviews.errPickRating": { sv: "Välj ett betyg", en: "Pick a rating" },
 "reviews.errBodyMin": { sv: "Recensionen måste vara minst 5 tecken", en: "Review must be at least 5 characters" },

 // SEO per page
 "seo.home.title": { sv: "Hälsosam snabbmat | 20g Protein på 5 minuter | PLÄNTLY", en: "Healthy Fast Food | 20g Protein Meals in 5 Minutes | PLÄNTLY" },
 "seo.home.description": { sv: "20g växtprotein klart på 5 minuter. Utvecklat i Sverige, hantverk från Italien. Hälsosam snabbmat utan kompromisser.", en: "20g plant protein meals ready in 5 minutes. Developed in Sweden, crafted in Italy. Healthy fast food without compromise." },
 "seo.products.title": { sv: "Produkter – Hälsosam proteinmat på 5 min | PLÄNTLY", en: "Products – Healthy protein meals in 5 min | PLÄNTLY" },
 "seo.products.description": { sv: "Utforska PLÄNTLY:s sortiment: hälsosam, proteinrik och klimatsmart färdigmat med 20g protein per portion. Klar på 5 minuter.", en: "Explore PLÄNTLY's range: healthy, high-protein and climate-smart ready meals with 20g protein per serving. Ready in 5 minutes." },
 "seo.nutrition.title": { sv: "Näring — PLÄNTLY | Högprotein plantbaserad näring", en: "Nutrition — PLÄNTLY | High-protein plant-based nutrition" },
 "seo.nutrition.description": { sv: "Se näringsinnehållet i PLÄNTLY:s måltider — 20g+ protein, balanserade makros och naturliga ingredienser.", en: "See the nutrition in PLÄNTLY meals — 20g+ protein, balanced macros and natural ingredients." },
 "seo.lifestyle.title": { sv: "Livsstil — PLÄNTLY | Måltider för din livsstil", en: "Lifestyle — PLÄNTLY | Meals for your lifestyle" },
 "seo.lifestyle.description": { sv: "Upptäck hur PLÄNTLY passar din livsstil — för atleter, kontorsarbetare, entreprenörer och alla däremellan.", en: "Discover how PLÄNTLY fits your lifestyle — for athletes, office workers, entrepreneurs and everyone in between." },
 "seo.about.title": { sv: "Om PLÄNTLY – Hälsosam & klimatsmart proteinmat för alla | PLÄNTLY", en: "About PLÄNTLY – Healthy & climate-smart protein meals for everyone | PLÄNTLY" },
 "seo.about.description": { sv: "PLÄNTLY grundades för att göra hälsosam, proteinrik och klimatsmart mat tillgänglig för alla – inte bara veganer. Snabb, god och utan kompromisser.", en: "PLÄNTLY was founded to make healthy, high-protein and climate-smart food accessible to everyone — not just vegans. Fast, delicious and uncompromising." },
 "seo.faq.title": { sv: "Vanliga frågor — PLÄNTLY", en: "Frequently Asked Questions — PLÄNTLY" },
 "seo.faq.description": { sv: "Svar på vanliga frågor om PLÄNTLY:s plantbaserade proteinmåltider, leverans, ingredienser och mer.", en: "Answers to common questions about PLÄNTLY's plant-based protein meals, delivery, ingredients and more." },
 "seo.contact.title": { sv: "Kontakt — PLÄNTLY", en: "Contact — PLÄNTLY" },
 "seo.contact.description": { sv: "Kontakta oss på PLÄNTLY. Frågor om våra plantbaserade proteinmåltider? Vi finns här för dig.", en: "Contact PLÄNTLY. Questions about our plant-based protein meals? We're here for you." },

 // Newsletter popup
 "newsletter.title": { sv: "Gå med i PLÄNTLY-familjen", en: "Join the PLÄNTLY family" },
 "newsletter.subtitle": { sv: "Få exklusiva erbjudanden & plantbaserad inspiration.", en: "Get exclusive offers & plant-based inspiration." },
 "newsletter.benefit1Title": { sv: "10% rabatt på din första beställning", en: "10% off your first order" },
 "newsletter.benefit1Desc": { sv: "Exklusiv rabatt för nya prenumeranter.", en: "Exclusive discount for new subscribers." },
 "newsletter.benefit2Title": { sv: "Gratis fraktuppdateringar", en: "Free shipping updates" },
 "newsletter.benefit2Desc": { sv: "Bli först med att veta om leveranserbjudanden.", en: "Be the first to know about delivery offers." },
 "newsletter.benefit3Title": { sv: "Recept & tips", en: "Recipes & tips" },
 "newsletter.benefit3Desc": { sv: "Veckovis plantbaserad näringsinspiration.", en: "Weekly plant-based nutrition inspiration." },
 "newsletter.placeholder": { sv: "din@epost.se", en: "your@email.com" },
 "newsletter.submit": { sv: "Prenumerera & spara 10%", en: "Subscribe & save 10%" },
 "newsletter.submitting": { sv: "Prenumererar…", en: "Subscribing…" },
 "newsletter.success": { sv: "Välkommen ombord! ", en: "Welcome aboard! " },
 "newsletter.successDesc": { sv: "Kolla din inkorg för en bekräftelse.", en: "Check your inbox for a confirmation." },
 "newsletter.alreadySubscribed": { sv: "Redan prenumerant!", en: "Already subscribed!" },
 "newsletter.alreadyDesc": { sv: "Denna e-post är redan registrerad.", en: "This email is already registered." },
 "newsletter.error": { sv: "Något gick fel", en: "Something went wrong" },
 "newsletter.errorDesc": { sv: "Försök igen senare.", en: "Please try again later." },
 "newsletter.disclaimer": { sv: "Genom att prenumerera godkänner du att ta emot marknadsföringsmail.\nAvprenumerera när som helst. Inget spam, aldrig.", en: "By subscribing you agree to receive marketing emails.\nUnsubscribe anytime. No spam, ever." },
 "newsletter.close": { sv: "Stäng", en: "Close" },

 // About
 "about.title": { sv: "Om PLÄNTLY", en: "About PLÄNTLY" },
 "about.subtitle": { sv: "Plantbaserade proteinmåltider — enkelt, gott och hållbart för det moderna livet.", en: "Plant-based protein meals — simple, delicious and sustainable for modern life." },
 "about.p1": { sv: "PLÄNTLY föddes i Skandinavien ur en enkel frustration: varför är det så svårt att äta bra när man har ont om tid? Snabbmat är ofta skräp, och hälsosam mat tar tid som de flesta inte har.", en: "PLÄNTLY was born in Scandinavia out of a simple frustration: why is it so hard to eat well when you're short on time? Fast food is often junk, and healthy food takes time most people don't have." },
 "about.p2": { sv: "Vi bestämde oss för att skapa något annorlunda — riktiga måltider, med riktigt protein, från riktiga växter. Inga pulver, inga shakes, inga kompromisser. Bara mat som är lika bra för dig som den smakar, klar på tiden det tar att koka vatten.", en: "We decided to create something different — real meals, with real protein, from real plants. No powders, no shakes, no compromises. Just food that's as good for you as it tastes, ready in the time it takes to boil water." },
 "about.p3": { sv: "Vårt team av kockar och nutritionister lade över ett år på att utveckla recept som levererar 20g plantprotein per portion, med balanserade makron, ärliga ingredienser och smaker man faktiskt längtar efter.", en: "Our team of chefs and nutritionists spent over a year developing recipes that deliver 20g plant protein per serving, with balanced macros, honest ingredients and flavours you actually crave." },
 "about.p4": { sv: "Idag litar atleter, kontor, entreprenörer och alla som vägrar välja mellan hälsa och bekvämlighet på PLÄNTLY. Vi är på ett uppdrag att göra plantbaserat protein till det enklaste valet för det moderna livet.", en: "Today, athletes, offices, entrepreneurs and everyone who refuses to choose between health and convenience trust PLÄNTLY. We're on a mission to make plant-based protein the easiest choice for modern life." },
 "about.founded": { sv: "Grundat i Stockholm", en: "Founded in Stockholm" },
 "about.mealsServed": { sv: "Serverade måltider", en: "Meals served" },
 "about.plantBasedStat": { sv: "Plantbaserat-Protein", en: "Plant-based Protein" },

 // Blog
 "blog.title": { sv: "Blogg", en: "Blog" },
 "blog.subtitle": { sv: "Näringsvetenskap, livsstilstips och hållbara mathistorier.", en: "Nutrition science, lifestyle tips and sustainable food stories." },
 "blog.noPosts": { sv: "Inga inlägg ännu. Kom tillbaka snart!", en: "No posts yet. Check back soon!" },

 // FAQ
 "faq.title": { sv: "Vanliga frågor", en: "Frequently Asked Questions" },
 "faq.subtitle": { sv: "Vanliga frågor om PLÄNTLY-måltider.", en: "Common questions about PLÄNTLY meals." },

 // Contact
 "contact.title": { sv: "Kontakta oss", en: "Contact Us" },
 "contact.subtitle": { sv: "Frågor, samarbeten eller bara vill säga hej? Vi hör gärna från dig.", en: "Questions, collaborations or just want to say hi? We'd love to hear from you." },
 "contact.name": { sv: "Namn", en: "Name" },
 "contact.namePlaceholder": { sv: "Ditt namn", en: "Your name" },
 "contact.email": { sv: "E-post", en: "Email" },
 "contact.emailPlaceholder": { sv: "din@epost.se", en: "your@email.com" },
 "contact.message": { sv: "Meddelande", en: "Message" },
 "contact.messagePlaceholder": { sv: "Ditt meddelande...", en: "Your message..." },
 "contact.submit": { sv: "Skicka meddelande", en: "Send message" },
 "contact.submitting": { sv: "Skickar…", en: "Sending…" },
 "contact.fillAll": { sv: "Vänligen fyll i alla fält", en: "Please fill in all fields" },
  "contact.messageTooShort": { sv: "Meddelandet måste vara minst 5 tecken", en: "Message must be at least 5 characters" },
 "contact.success": { sv: "Tack för ditt meddelande! Vi återkommer snart.", en: "Thanks for your message! We'll get back to you soon." },
 "contact.error": { sv: "Något gick fel. Försök igen.", en: "Something went wrong. Please try again." },
 "contact.orEmail": { sv: "Eller maila oss direkt på", en: "Or email us directly at" },

 // Lifestyle page
 "lifestylePage.title": { sv: "Byggd för alla livsstilar", en: "Built for Every Lifestyle" },
 "lifestylePage.subtitle": { sv: "PLÄNTLY passar in i ditt liv, inte tvärtom.", en: "PLÄNTLY fits into your life, not the other way around." },
 "lifestylePage.athleteTitle": { sv: "Atleter & fitness", en: "Athletes & Fitness" },
 "lifestylePage.athleteDesc": { sv: "Alla har inte tid att laga tre mål om dagen. PLÄNTLY gör det enkelt att äta bra, även på dina mest hektiska dagar. Riktig mat, riktigt protein, noll kompromisser.", en: "Power your training with 20g plant protein per meal. PLÄNTLY meals are designed for fast recovery and sustained energy, whether you lift, run or train for your next competition." },
 "lifestylePage.officeTitle": { sv: "Kontor & företag", en: "Offices & Companies" },
 "lifestylePage.officeDesc": { sv: "Uppgradera era arbetsplatsmåltider. PLÄNTLY kontorspaket håller teamen mätta med näringsrika, varma måltider — inget kök, ingen kock, inget krångel. Bara kokande vatten och 5 minuter.", en: "Upgrade your workplace meals. PLÄNTLY office packs keep teams fuelled with nutritious, hot meals — no kitchen, no chef, no hassle. Just boiling water and 5 minutes." },
 "lifestylePage.entrepreneurTitle": { sv: "Entreprenörer & frilansare", en: "Entrepreneurs & Freelancers" },
 "lifestylePage.entrepreneurDesc": { sv: "När du bygger något har du inte tid för dålig mat. PLÄNTLY håller dig skärpt med balanserad näring som tar mindre tid än att beställa en kaffe.", en: "When you're building something, you don't have time for bad food. PLÄNTLY keeps you sharp with balanced nutrition that takes less time than ordering a coffee." },
 "lifestylePage.everydayTitle": { sv: "Vardaglig hälsosam mat", en: "Everyday Healthy Eating" },
 "lifestylePage.everydayDesc": { sv: "Alla har inte tid att laga tre mål om dagen. PLÄNTLY gör det enkelt att äta bra, även dina mest hektiska dagar. Riktig mat, riktigt protein, noll kompromisser.", en: "Not everyone has time to cook three meals a day. PLÄNTLY makes it easy to eat well, even on your busiest days. Real food, real protein, zero compromises." },

 // 404
 "notFound.title": { sv: "Hoppsan! Sidan hittades inte", en: "Oops! Page not found" },
 "notFound.link": { sv: "Tillbaka till startsidan", en: "Back to homepage" },

 // Quiz
 "quiz.title": { sv: "Hitta ditt perfekta paket", en: "Find your perfect pack" },
 "quiz.subtitle": { sv: "Svara på 3 snabba frågor — vi matchar dig med rätt paket.", en: "Answer 3 quick questions — we'll match you with the right pack." },
 "quiz.quizTitle": { sv: "Måltidsquiz", en: "Meal Quiz" },
 "quiz.quizDesc": { sv: "Osäker på vilket paket som passar dig? Vi hjälper dig — det tar bara 30 sekunder.", en: "Not sure which pack suits you? We'll help — it only takes 30 seconds." },
 "quiz.start": { sv: "Starta quiz", en: "Start quiz" },
 "quiz.question": { sv: "Fråga", en: "Question" },
 "quiz.of": { sv: "av", en: "of" },
 "quiz.back": { sv: "Tillbaka", en: "Back" },
 "quiz.next": { sv: "Nästa", en: "Next" },
 "quiz.seeResult": { sv: "Se resultat", en: "See result" },
 "quiz.yourMatch": { sv: "Din match", en: "Your match" },
 "quiz.addToCart": { sv: "Lägg i varukorg", en: "Add to cart" },
 "quiz.loading": { sv: "Laddar…", en: "Loading…" },
 "quiz.retake": { sv: "Gör om quiz", en: "Retake quiz" },

 // Quiz questions
 "quiz.q1": { sv: "Hur skulle du beskriva din livsstil?", en: "How would you describe your lifestyle?" },
 "quiz.q1o1": { sv: "Lugn & balanserad", en: "Calm & balanced" },
 "quiz.q1o2": { sv: "Aktiv & på språng", en: "Active & on the go" },
 "quiz.q1o3": { sv: "Upptagen yrkesperson", en: "Busy professional" },
 "quiz.q1o4": { sv: "Team / kontorskultur", en: "Team / office culture" },
 "quiz.q2": { sv: "Hur många plantbaserade måltider vill du ha per vecka?", en: "How many plant-based meals do you want per week?" },
 "quiz.q2o1": { sv: "Några (2–3)", en: "A few (2–3)" },
 "quiz.q2o2": { sv: "Dagligen (5–7)", en: "Daily (5–7)" },
 "quiz.q2o3": { sv: "Flera per dag", en: "Multiple per day" },
 "quiz.q2o4": { sv: "För hela gänget", en: "For the whole crew" },
 "quiz.q3": { sv: "Vad är ditt främsta näringsmål?", en: "What is your main nutrition goal?" },
 "quiz.q3o1": { sv: "Testa något nytt", en: "Try something new" },
 "quiz.q3o2": { sv: "Driva min träning", en: "Fuel my training" },
 "quiz.q3o3": { sv: "Äta hälsosammare på jobbet", en: "Eat healthier at work" },
 "quiz.q3o4": { sv: "Mätta en grupp prisvärt", en: "Feed a group affordably" },

 // Quiz bundles
 "quiz.starterExplanation": { sv: "Perfekt för att prova PLÄNTLY — 12 måltider för att utforska alla våra smaker i din egen takt.", en: "Perfect for trying PLÄNTLY — 12 meals to explore all our flavours at your own pace." },
 "quiz.athleteExplanation": { sv: "Designad för aktiva livsstilar — 24 proteinrika måltider som håller dig laddad genom varje pass.", en: "Designed for active lifestyles — 24 high-protein meals to keep you fuelled through every session." },
 "quiz.officeExplanation": { sv: "Hälsosamma luncher fixade — 48 måltider för den upptagna yrkespersonen som vill ha näring utan krångel.", en: "Healthy lunches sorted — 48 meals for the busy professional who wants nutrition without the hassle." },
  "quiz.bigOfficeExplanation": { sv: "Mätta hela teamet — 96 måltider till bästa pris per portion. Perfekt för kontor och grupper.", en: "Feed the whole team — 96 meals at the best price per serving. Perfect for offices and groups." },
};

export const useLangStore = create<LangStore>()(
 persist(
 (set, get) => ({
 lang: "sv",
 setLang: (lang) => set({ lang }),
 t: (key: string) => {
 const entry = translations[key];
 if (!entry) return key;
 return entry[get().lang] || entry.sv || key;
 },
 }),
 {
 name: "plantely-lang",
 storage: createJSONStorage(() => localStorage),
 partialize: (state) => ({ lang: state.lang }),
 }
 )
);

// Hook shortcut
export const useTranslation = () => {
 const lang = useLangStore((s) => s.lang);
 const t = useLangStore((s) => s.t);
 const setLang = useLangStore((s) => s.setLang);
 return { lang, t, setLang };
};
