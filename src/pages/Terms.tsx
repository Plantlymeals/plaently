import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { RotateCcw, ShieldCheck, Truck, Scale, AlertTriangle, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const COPY = {
  sv: {
    seoTitle: "Köpvillkor | PLÄNTLY",
    seoDesc: "PLÄNTLY köpvillkor: priser i SEK inkl. moms, fri frakt över 399 kr, 14 dagars ångerrätt, 3 års reklamationsrätt och tvistlösning via ARN enligt svensk lag.",
    label: "Köpvillkor",
    h1: "Tydliga villkor. Inga överraskningar.",
    sub: "Dessa villkor gäller för alla köp på plaently.com. Senast uppdaterad: maj 2026 · Version 1.0",
    quick: [
      { icon: RotateCcw, label: "Ångerrätt", value: "14 dagar" },
      { icon: ShieldCheck, label: "Reklamation", value: "3 år" },
      { icon: Truck, label: "Fri frakt", value: "399 kr+" },
      { icon: Scale, label: "Tvistlösning", value: "ARN" },
    ],
    payments: ["Klarna", "Swish", "Visa", "Mastercard", "PayPal"],
    deliveryTh: ["Order", "Frakt", "Leveranstid"],
    deliveryRows: [
      { order: "Under 399 kr", cost: "49 kr", time: "2–4 vardagar" },
      { order: "399 kr eller mer", cost: "Fri frakt", time: "2–4 vardagar" },
    ],
    s1: { t: "1. Om oss", lines: ["PLÄNTLY AB · Org.nr SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten, Sverige"] },
    s2: { t: "2. Tillämpning", p1: "Dessa köpvillkor gäller för alla köp som görs via plaently.com. Genom att genomföra ett köp accepterar du dessa villkor i sin helhet. Villkoren gäller mellan dig som kund och PLÄNTLY AB.", p2: "Vi förbehåller oss rätten att ändra villkoren. Den version som gällde vid ditt köptillfälle är den som tillämpas på din order." },
    s3: { t: "3. Priser och betalning", p1: "Alla priser anges i svenska kronor (SEK) inklusive moms (25%). Vi förbehåller oss rätten att ändra priser utan föregående meddelande, dock gäller det pris som visades när du genomförde köpet.", paymentsLabel: "Accepterade betalningsmetoder:", note: "Vi lagrar inga kortuppgifter — all kortbetalning hanteras av certifierade betaltjänster." },
    s4: { t: "4. Beställning och orderbekräftelse", p1: "Ett bindande köpeavtal uppstår när du mottar en orderbekräftelse via e-post. Kontrollera att orderbekräftelsen stämmer och kontakta oss omedelbart på hello@plaently.com om något är fel.", calloutT: "Vi förbehåller oss rätten att avboka en order vid:", calloutItems: ["Uppenbart felaktigt pris på grund av tekniskt fel", "Betalning som inte kan verifieras", "Produkter som inte längre finns i lager"] },
    s5: { t: "5. Leverans", body: "Leverans sker med PostNord och DHL. Du får ett spårningsnummer via e-post när ordern är avsänd. Beställningar lagda innan kl. 12.00 på vardagar skickas normalt samma dag. Leverans sker för närvarande endast inom Sverige.", body2: "PLÄNTLY AB ansvarar för varan tills den levererats till angiven adress eller hämtats ut på utlämningsställe." },
    s6: { t: "6. Ångerrätt", greenT: "14 dagars ångerrätt från mottagen order (Distansavtalslagen 2005:59).", warnLabel: "Undantag:", warnBody: "Ångerrätten gäller INTE för öppnade livsmedelsförpackningar — av hygien- och livsmedelssäkerhetsskäl (Distansavtalslagen 2 kap. 11 § punkt 4). Oöppnade produkter kan returneras inom 14 dagar. Returfrakten bekostas av kunden. Återbetalning sker inom 14 dagar från mottagen retur.", footer1: "Utöva ångerrätten genom att kontakta ", footer2: " med ditt ordernummer och anledning till retur." },
    s7: { t: "7. Reklamation", greenT: "3 års reklamationsrätt (Konsumentköplagen 2022:260).", body: "Vid fel eller skada: ta ett foto och skicka till hello@plaently.com med ditt ordernummer. Vi bekräftar och löser reklamationer inom 24 timmar på vardagar. Du har rätt till reparation eller omleverans, prisavdrag eller hävning av köpet vid väsentligt fel." },
    s8: { t: "8. Fel i leveransen", body1: "Fel produkter eller ofullständig order? Kontakta ", body2: ". Vi rättar felet utan extra kostnad inom 24 timmar på vardagar." },
    s9: { t: "9. Produktinformation", body: "Vi strävar efter korrekt produktinformation. Produktbilder är illustrativa och kan avvika något från faktisk produkt. Vid avvikelse som påverkar ditt köpbeslut, kontakta oss innan du slutför beställningen.", warnLabel: "Allergener", warnBody: " anges på varje produktsida och på förpackningen. Det är kundens ansvar att kontrollera ingredienslistor innan köp. Frågor? Kontakta hello@plaently.com." },
    s10: { t: "10. Personuppgifter", body: "Vi behandlar dina personuppgifter i enlighet med vår integritetspolicy och GDPR. Dina uppgifter används enbart för att genomföra och leverera din order samt för kommunikation kopplad till denna.", link: "Läs vår integritetspolicy →" },
    s11: { t: "11. Cookies", body: "Vi använder cookies på webbplatsen. Mer information finns i vår integritetspolicy och cookiepolicy." },
    s12: { t: "12. Immateriella rättigheter", body: "Allt innehåll på plaently.com — text, bilder, logotyper, design och varumärket PLÄNTLY — ägs av PLÄNTLY AB och skyddas av upphovsrätt och varumärkesrätt. Innehållet får inte kopieras, reproduceras eller användas kommersiellt utan skriftligt tillstånd." },
    s13: { t: "13. Ansvarsbegränsning", body: "PLÄNTLY AB ansvarar inte för skador som uppstår till följd av force majeure (strejk, naturkatastrof, pandemi, myndighetsbeslut), fel hos tredje part (fraktbolag, betaltjänst) eller obehörig användning av ditt konto. Vårt ansvar är i alla fall begränsat till värdet av din order." },
    s14: { t: "14. Tvistlösning", intro: "Vi strävar alltid efter att lösa tvister direkt med kunden. Om vi inte kan nå en överenskommelse kan du vända dig till:", arnT: "Allmänna Reklamationsnämnden (ARN)", arnLines: ["Box 174, 101 23 Stockholm", "www.arn.se"], arnBody: "Vi åtar oss att delta i ARN:s prövning.", odrT: "EU:s plattform för tvistlösning", odrLines: ["ec.europa.eu/consumers/odr"], odrBody: "Alternativ för EU-baserade konsumenter.", lawLabel: "Tillämplig lag:", lawBody: " Svensk lag. Tvist som inte löses via ARN avgörs i svensk domstol med Stockholms tingsrätt som första instans." },
    s15: { t: "15. Kontakt", lines: ["PLÄNTLY AB · Org.nr SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten", "hello@plaently.com · www.plaently.com"], note: "Kundtjänst svarar inom 24 timmar på vardagar." },
    footerNote: "Dessa villkor gäller från maj 2026 och ersätter tidigare versioner. Tillämplig lag: Distansavtalslagen (2005:59) och Konsumentköplagen (2022:260).",
  },
  en: {
    seoTitle: "Terms & Conditions | PLÄNTLY",
    seoDesc: "PLÄNTLY purchase terms: prices in SEK incl. VAT, free shipping over SEK 399, 14-day right of withdrawal, 3-year complaint period and ARN dispute resolution under Swedish law.",
    label: "Terms & Conditions",
    h1: "Clear terms. No surprises.",
    sub: "These terms apply to all purchases on plaently.com. Last updated: May 2026 · Version 1.0",
    quick: [
      { icon: RotateCcw, label: "Withdrawal", value: "14 days" },
      { icon: ShieldCheck, label: "Complaint", value: "3 years" },
      { icon: Truck, label: "Free shipping", value: "SEK 399+" },
      { icon: Scale, label: "Disputes", value: "ARN" },
    ],
    payments: ["Klarna", "Swish", "Visa", "Mastercard", "PayPal"],
    deliveryTh: ["Order", "Shipping", "Delivery time"],
    deliveryRows: [
      { order: "Under SEK 399", cost: "SEK 49", time: "2–4 business days" },
      { order: "SEK 399 or more", cost: "Free shipping", time: "2–4 business days" },
    ],
    s1: { t: "1. About us", lines: ["PLÄNTLY AB · Reg. no. SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten, Sweden"] },
    s2: { t: "2. Application", p1: "These terms apply to all purchases made via plaently.com. By completing a purchase, you accept these terms in full. The terms apply between you as a customer and PLÄNTLY AB.", p2: "We reserve the right to change the terms. The version in force at the time of your purchase is the one that applies to your order." },
    s3: { t: "3. Prices and payment", p1: "All prices are stated in Swedish kronor (SEK) including VAT (25%). We reserve the right to change prices without prior notice, however the price displayed at the time of purchase applies.", paymentsLabel: "Accepted payment methods:", note: "We store no card details — all card payments are handled by certified payment providers." },
    s4: { t: "4. Order and confirmation", p1: "A binding sales contract arises when you receive an order confirmation by email. Check that the order confirmation is correct and contact us immediately at hello@plaently.com if anything is wrong.", calloutT: "We reserve the right to cancel an order in case of:", calloutItems: ["Obviously incorrect price due to a technical error", "Payment that cannot be verified", "Products no longer in stock"] },
    s5: { t: "5. Delivery", body: "Delivery is made via PostNord and DHL. You will receive a tracking number by email when the order ships. Orders placed before 12:00 noon on weekdays are normally shipped the same day. Delivery is currently available within Sweden only.", body2: "PLÄNTLY AB is responsible for the goods until they are delivered to the specified address or collected at a pickup point." },
    s6: { t: "6. Right of withdrawal", greenT: "14 days right of withdrawal from receiving your order (Swedish Distance Contracts Act 2005:59).", warnLabel: "Exception:", warnBody: "The right of withdrawal does NOT apply to opened food packaging — for hygiene and food safety reasons (Distance Contracts Act ch. 2 sec. 11 point 4). Unopened products may be returned within 14 days. Return shipping is paid by the buyer. Refunds are issued within 14 days of receiving the return.", footer1: "Exercise the right of withdrawal by contacting ", footer2: " with your order number and reason for return." },
    s7: { t: "7. Complaints", greenT: "3-year complaint right (Swedish Consumer Sales Act 2022:260).", body: "In case of a defect or damage: take a photo and send it to hello@plaently.com with your order number. We confirm and resolve complaints within 24 hours on weekdays. You have the right to repair or replacement, price reduction or cancellation of the purchase in case of a material defect." },
    s8: { t: "8. Errors in delivery", body1: "Wrong products or an incomplete order? Contact ", body2: ". We'll fix the error at no extra cost within 24 hours on weekdays." },
    s9: { t: "9. Product information", body: "We strive for accurate product information. Product images are illustrative and may differ slightly from the actual product. If a discrepancy affects your purchase decision, contact us before completing the order.", warnLabel: "Allergens", warnBody: " are listed on each product page and on the packaging. It is the customer's responsibility to check ingredient lists before purchase. Questions? Contact hello@plaently.com." },
    s10: { t: "10. Personal data", body: "We process your personal data in accordance with our privacy policy and the GDPR. Your data is only used to fulfil and deliver your order and for related communication.", link: "Read our privacy policy →" },
    s11: { t: "11. Cookies", body: "We use cookies on the website. More information is available in our privacy and cookie policy." },
    s12: { t: "12. Intellectual property", body: "All content on plaently.com — text, images, logos, design and the PLÄNTLY brand — is owned by PLÄNTLY AB and protected by copyright and trademark law. Content may not be copied, reproduced or used commercially without written permission." },
    s13: { t: "13. Limitation of liability", body: "PLÄNTLY AB is not liable for damages arising from force majeure (strike, natural disaster, pandemic, government decision), faults of third parties (carriers, payment providers) or unauthorized use of your account. Our liability is in any case limited to the value of your order." },
    s14: { t: "14. Dispute resolution", intro: "We always strive to resolve disputes directly with the customer. If we cannot reach an agreement, you can contact:", arnT: "Swedish National Board for Consumer Disputes (ARN)", arnLines: ["Box 174, 101 23 Stockholm", "www.arn.se"], arnBody: "We commit to participating in ARN's review.", odrT: "EU Online Dispute Resolution platform", odrLines: ["ec.europa.eu/consumers/odr"], odrBody: "Alternative for EU-based consumers.", lawLabel: "Applicable law:", lawBody: " Swedish law. Disputes not resolved via ARN are settled in Swedish court with Stockholm District Court as first instance." },
    s15: { t: "15. Contact", lines: ["PLÄNTLY AB · Reg. no. SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten", "hello@plaently.com · www.plaently.com"], note: "Customer service responds within 24 hours on weekdays." },
    footerNote: "These terms apply from May 2026 and replace previous versions. Applicable law: the Swedish Distance Contracts Act (2005:59) and Consumer Sales Act (2022:260).",
  },
} as const;

const Terms = () => {
  const { lang } = useTranslation();
  const isEn = lang !== "sv";
  const c = COPY[isEn ? "en" : "sv"];
  const path = isEn ? "/terms-of-service" : "/kopsvillkor";
  const privacyPath = isEn ? "/privacy-policy" : "/integritetspolicy";
  const alternates = [
    { hreflang: "en", path: "/terms-of-service" },
    { hreflang: "sv", path: "/kopsvillkor" },
    { hreflang: "x-default", path: "/terms-of-service" },
  ];

  const baseUrl = "https://plantlymeals.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "PLÄNTLY AB",
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        email: "hello@plaently.com",
        vatID: "SE559400472201",
        address: { "@type": "PostalAddress", streetAddress: "Vretensborgsvägen 5", postalCode: "126 30", addressLocality: "Hägersten", addressCountry: "SE" },
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}${path}#webpage`,
        url: `${baseUrl}${path}`,
        name: c.seoTitle,
        description: c.seoDesc,
        inLanguage: isEn ? "en" : "sv-SE",
        publisher: { "@id": `${baseUrl}/#organization` },
        dateModified: "2026-05-01",
      },
    ],
  };

  return (
    <Layout>
      <SEOHead title={c.seoTitle} description={c.seoDesc} path={path} type="article" jsonLd={jsonLd} locale={isEn ? "en" : "sv"} alternates={alternates} />

      <section className="bg-foreground text-primary-foreground">
        <div className="container py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{c.label}</p>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl tracking-tight mb-6">{c.h1}</h1>
          <p className="text-lg font-light text-primary-foreground/55 max-w-[520px] leading-relaxed">{c.sub}</p>
        </div>
      </section>

      <section className="bg-muted">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.quick.map((q) => (
              <div key={q.label} className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-2">
                <q.icon className="w-5 h-5 text-primary" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{q.label}</p>
                <p className="font-heading font-bold text-base">{q.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-16 md:py-20">
          <div className="max-w-[860px] mx-auto space-y-14 text-[16px] leading-[1.75] text-foreground/75 font-light">

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s1.t}</h2>
              <div className="space-y-1">
                {c.s1.lines.map((l, i) => <p key={l} className={i === 0 ? "font-semibold text-foreground" : ""}>{l}</p>)}
                <p><a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a> · www.plaently.com</p>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s2.t}</h2>
              <p>{c.s2.p1}</p>
              <p className="mt-4">{c.s2.p2}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s3.t}</h2>
              <p>{c.s3.p1}</p>
              <p className="mt-5 font-semibold text-foreground">{c.s3.paymentsLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.payments.map((p) => (
                  <span key={p} className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted border border-border text-sm font-medium text-foreground">{p}</span>
                ))}
              </div>
              <p className="mt-5">{c.s3.note}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s4.t}</h2>
              <p>{c.s4.p1}</p>
              <div className="mt-5 border-l-4 border-primary bg-muted rounded-xl p-5 md:p-6">
                <p className="font-semibold text-foreground mb-2">{c.s4.calloutT}</p>
                <ul className="space-y-1">
                  {c.s4.calloutItems.map((item) => <li key={item}>· {item}</li>)}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s5.t}</h2>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-foreground">
                    <tr>{c.deliveryTh.map((h) => <th key={h} className="text-left p-4 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {c.deliveryRows.map((r) => (
                      <tr key={r.order} className="border-t border-border">
                        <td className="p-4">{r.order}</td>
                        <td className="p-4 font-medium text-foreground">{r.cost}</td>
                        <td className="p-4">{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5">{c.s5.body}</p>
              <p className="mt-3">{c.s5.body2}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s6.t}</h2>
              <div className="rounded-2xl border border-primary/25 bg-primary/10 p-6 flex gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-foreground font-medium">{c.s6.greenT}</p>
              </div>
              <div className="mt-4 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                <p className="text-foreground/80"><span className="font-semibold text-foreground">{c.s6.warnLabel}</span> {c.s6.warnBody}</p>
              </div>
              <p className="mt-5">{c.s6.footer1}<a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a>{c.s6.footer2}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s7.t}</h2>
              <div className="rounded-2xl border border-primary/25 bg-primary/10 p-6 flex gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-foreground font-medium">{c.s7.greenT}</p>
              </div>
              <p className="mt-5">{c.s7.body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s8.t}</h2>
              <p>{c.s8.body1}<a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a>{c.s8.body2}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s9.t}</h2>
              <p>{c.s9.body}</p>
              <div className="mt-5 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                <p className="text-foreground/80"><span className="font-semibold text-foreground">{c.s9.warnLabel}</span>{c.s9.warnBody}</p>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s10.t}</h2>
              <p>{c.s10.body}</p>
              <Link to={privacyPath} className="inline-block mt-3 text-primary font-medium hover:underline">{c.s10.link}</Link>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s11.t}</h2>
              <p>{c.s11.body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s12.t}</h2>
              <p>{c.s12.body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s13.t}</h2>
              <p>{c.s13.body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s14.t}</h2>
              <p>{c.s14.intro}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="bg-background border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-bold text-foreground mb-2">{c.s14.arnT}</h3>
                  {c.s14.arnLines.map((l) => <p key={l} className="text-sm">{l}</p>)}
                  <p className="text-sm mt-3">{c.s14.arnBody}</p>
                </div>
                <div className="bg-background border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-bold text-foreground mb-2">{c.s14.odrT}</h3>
                  {c.s14.odrLines.map((l) => <p key={l} className="text-sm">{l}</p>)}
                  <p className="text-sm mt-3">{c.s14.odrBody}</p>
                </div>
              </div>
              <p className="mt-5"><span className="font-semibold text-foreground">{c.s14.lawLabel}</span>{c.s14.lawBody}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s15.t}</h2>
              <div className="bg-foreground text-primary-foreground rounded-2xl p-8 space-y-1">
                {c.s15.lines.map((l, i) => (
                  <p key={l} className={i === 0 ? "font-semibold" : "text-primary-foreground/70"}>{l}</p>
                ))}
                <p className="pt-3 text-primary-foreground/70">{c.s15.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="container py-10">
          <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">{c.footerNote}</p>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;