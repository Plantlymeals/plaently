# Tre riktade text/länk-ändringar på plaently.com

Endast dessa tre element rörs — ingen layout, styling, ikoner eller andra sektioner ändras.

## 1) Hero-knappens länk (startsidan)

**Fil:** `src/components/home/HeroSection.tsx`

Knappen "Handla Starter Pack" (`hero.ctaStarter`) länkar idag till `/products`. Ändra dess `to` till `/product/starter-pack-12-cups-1`. Knappen "Prova PLÄNTLY" (`hero.ctaTry`) lämnas orörd — den behåller `ctaLink = "/products"`.

```diff
- <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90">
-   <Link to="/products">{t("hero.ctaStarter")}</Link>
+ <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90">
+   <Link to="/product/starter-pack-12-cups-1">{t("hero.ctaStarter")}</Link>
  </Button>
```

Handle `starter-pack-12-cups-1` är verifierad: finns i `productSeo.ts` och i `public/sitemap.xml`. Rutten `/product/$handle` finns.

## 2) Trust-text under Hero

**Fil:** `src/lib/i18n.ts` — nyckel `trust.loved`

```diff
- "trust.loved": { sv: "Älskad av yrkesverksamma, atleter och moderna arbetsplatser.", en: "Loved by professionals, athletes and modern workplaces." },
+ "trust.loved": { sv: "Utvecklat i Sverige, hantverk från Italien.", en: "Developed in Sweden, crafted in Italy." },
```

Styling/typsnitt styrs av `TrustSection.tsx` (klass `text-lg md:text-xl text-muted-foreground font-medium`) och påverkas inte — endast textsträngen byts. Engelska översätts motsvarande för att hålla SV/EN konsekventa.

## 3) "Hållbart"-kortet i "Varför PLÄNTLY?"

**Fil:** `src/lib/i18n.ts` — nycklar `why.sustainable` + `why.sustainableDesc`

```diff
- "why.sustainable": { sv: "Hållbart", en: "Plant-Forward" },
- "why.sustainableDesc": { sv: "Lägre CO₂ än traditionella proteinalternativ", en: "Less CO₂ than traditional protein alternatives" },
+ "why.sustainable": { sv: "Inget kylskåp behövs", en: "No fridge needed" },
+ "why.sustainableDesc": { sv: "Rumstemperat – perfekt för kontoret, resan eller skafferiet.", en: "Room temperature — perfect for the office, travel or pantry." },
```

Ikonen (`Sprout`) i `WhySection.tsx` lämnas oförändrad — enligt instruktionen rör vi inget annat.

## Verifiering

Efter ändringarna: bygg/typecheck, titta på startsidan i preview för att bekräfta att knappen pekar rätt, trust-texten är ny och kortet visar ny rubrik/text. Ingen publicering förrän du godkänner.
