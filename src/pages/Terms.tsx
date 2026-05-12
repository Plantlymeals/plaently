import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { RotateCcw, ShieldCheck, Truck, Scale, AlertTriangle, Check } from "lucide-react";

const Terms = () => {
  const { pathname } = useLocation();
  const isEn = pathname === "/terms-of-service";

  const seo = isEn
    ? {
        title: "Terms & Conditions | PLÄNTLY",
        description:
          "PLÄNTLY purchase terms: prices in SEK incl. VAT, free shipping over 399 kr, 14-day right of withdrawal, 3-year complaint period and ARN dispute resolution under Swedish law.",
        path: "/terms-of-service",
        webPageName: "Terms & Conditions — PLÄNTLY",
      }
    : {
        title: "Köpvillkor | PLÄNTLY",
        description:
          "PLÄNTLY köpvillkor: priser i SEK inkl. moms, fri frakt över 399 kr, 14 dagars ångerrätt, 3 års reklamationsrätt och tvistlösning via ARN enligt svensk lag.",
        path: "/kopsvillkor",
        webPageName: "Köpvillkor — PLÄNTLY",
      };

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
        address: {
          "@type": "PostalAddress",
          streetAddress: "Vretensborgsvägen 5",
          postalCode: "126 30",
          addressLocality: "Hägersten",
          addressCountry: "SE",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "hello@plaently.com",
          availableLanguage: ["Swedish", "English"],
        },
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}${seo.path}#webpage`,
        url: `${baseUrl}${seo.path}`,
        name: seo.webPageName,
        description: seo.description,
        inLanguage: isEn ? "en" : "sv-SE",
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: { "@id": `${baseUrl}/#organization` },
        publisher: { "@id": `${baseUrl}/#organization` },
        dateModified: "2026-05-01",
        breadcrumb: { "@id": `${baseUrl}${seo.path}#breadcrumbs` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${seo.path}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isEn ? "Home" : "Hem", item: baseUrl },
          { "@type": "ListItem", position: 2, name: seo.webPageName, item: `${baseUrl}${seo.path}` },
        ],
      },
    ],
  };

  const quick = [
    { icon: RotateCcw, label: "Ångerrätt", value: "14 dagar" },
    { icon: ShieldCheck, label: "Reklamation", value: "3 år" },
    { icon: Truck, label: "Fri frakt", value: "399 kr+" },
    { icon: Scale, label: "Tvistlösning", value: "ARN" },
  ];

  const payments = ["Klarna", "Swish", "Visa", "Mastercard", "PayPal"];

  const deliveryRows = [
    { order: "Under 399 kr", cost: "49 kr", time: "2–4 vardagar" },
    { order: "399 kr eller mer", cost: "Fri frakt", time: "2–4 vardagar" },
  ];

  return (
    <Layout>
      <SEOHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        type="article"
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="bg-foreground text-primary-foreground">
        <div className="container py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Köpvillkor</p>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl tracking-tight mb-6">
            Tydliga villkor. Inga överraskningar.
          </h1>
          <p className="text-lg font-light text-primary-foreground/55 max-w-[520px] leading-relaxed">
            Dessa villkor gäller för alla köp på plaently.com. Senast uppdaterad: maj 2026 · Version 1.0
          </p>
        </div>
      </section>

      {/* QUICK INFO */}
      <section className="bg-muted">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quick.map((q) => (
              <div key={q.label} className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-2">
                <q.icon className="w-5 h-5 text-primary" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{q.label}</p>
                <p className="font-heading font-bold text-base">{q.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="bg-background">
        <div className="container py-16 md:py-20">
          <div className="max-w-[860px] mx-auto space-y-14 text-[16px] leading-[1.75] text-foreground/75 font-light">

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">1. Om oss</h2>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">PLÄNTLY AB · Org.nr SE559400472201</p>
                <p>Vretensborgsvägen 5, 126 30 Hägersten, Sverige</p>
                <p><a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a> · www.plaently.com</p>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">2. Tillämpning</h2>
              <p>Dessa köpvillkor gäller för alla köp som görs via plaently.com. Genom att genomföra ett köp accepterar du dessa villkor i sin helhet. Villkoren gäller mellan dig som kund och PLÄNTLY AB.</p>
              <p className="mt-4">Vi förbehåller oss rätten att ändra villkoren. Den version som gällde vid ditt köptillfälle är den som tillämpas på din order.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">3. Priser och betalning</h2>
              <p>Alla priser anges i svenska kronor (SEK) inklusive moms (25%). Vi förbehåller oss rätten att ändra priser utan föregående meddelande, dock gäller det pris som visades när du genomförde köpet.</p>
              <p className="mt-5 font-semibold text-foreground">Accepterade betalningsmetoder:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {payments.map((p) => (
                  <span key={p} className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted border border-border text-sm font-medium text-foreground">{p}</span>
                ))}
              </div>
              <p className="mt-5">Vi lagrar inga kortuppgifter — all kortbetalning hanteras av certifierade betaltjänster.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">4. Beställning och orderbekräftelse</h2>
              <p>Ett bindande köpeavtal uppstår när du mottar en orderbekräftelse via e-post. Kontrollera att orderbekräftelsen stämmer och kontakta oss omedelbart på hello@plaently.com om något är fel.</p>
              <div className="mt-5 border-l-4 border-primary bg-muted rounded-xl p-5 md:p-6">
                <p className="font-semibold text-foreground mb-2">Vi förbehåller oss rätten att avboka en order vid:</p>
                <ul className="space-y-1">
                  <li>· Uppenbart felaktigt pris på grund av tekniskt fel</li>
                  <li>· Betalning som inte kan verifieras</li>
                  <li>· Produkter som inte längre finns i lager</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">5. Leverans</h2>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-foreground">
                    <tr>
                      <th className="text-left p-4 font-semibold">Order</th>
                      <th className="text-left p-4 font-semibold">Frakt</th>
                      <th className="text-left p-4 font-semibold">Leveranstid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryRows.map((r) => (
                      <tr key={r.order} className="border-t border-border">
                        <td className="p-4">{r.order}</td>
                        <td className="p-4 font-medium text-foreground">{r.cost}</td>
                        <td className="p-4">{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5">Leverans sker med PostNord och DHL. Du får ett spårningsnummer via e-post när ordern är avsänd. Beställningar lagda innan kl. 12.00 på vardagar skickas normalt samma dag. Leverans sker för närvarande endast inom Sverige.</p>
              <p className="mt-3">PLÄNTLY AB ansvarar för varan tills den levererats till angiven adress eller hämtats ut på utlämningsställe.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">6. Ångerrätt</h2>
              <div className="rounded-2xl border border-primary/25 bg-primary/10 p-6 flex gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-foreground font-medium">14 dagars ångerrätt från mottagen order (Distansavtalslagen 2005:59).</p>
              </div>
              <div className="mt-4 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                <p className="text-foreground/80">
                  <span className="font-semibold text-foreground">Undantag:</span> Ångerrätten gäller INTE för öppnade livsmedelsförpackningar — av hygien- och livsmedelssäkerhetsskäl (Distansavtalslagen 2 kap. 11 § punkt 4). Oöppnade produkter kan returneras inom 14 dagar. Returfrakten bekostas av kunden. Återbetalning sker inom 14 dagar från mottagen retur.
                </p>
              </div>
              <p className="mt-5">Utöva ångerrätten genom att kontakta <a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a> med ditt ordernummer och anledning till retur.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">7. Reklamation</h2>
              <div className="rounded-2xl border border-primary/25 bg-primary/10 p-6 flex gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-foreground font-medium">3 års reklamationsrätt (Konsumentköplagen 2022:260).</p>
              </div>
              <p className="mt-5">Vid fel eller skada: ta ett foto och skicka till hello@plaently.com med ditt ordernummer. Vi bekräftar och löser reklamationer inom 24 timmar på vardagar. Du har rätt till reparation eller omleverans, prisavdrag eller hävning av köpet vid väsentligt fel.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">8. Fel i leveransen</h2>
              <p>Fel produkter eller ofullständig order? Kontakta <a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a>. Vi rättar felet utan extra kostnad inom 24 timmar på vardagar.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">9. Produktinformation</h2>
              <p>Vi strävar efter korrekt produktinformation. Produktbilder är illustrativa och kan avvika något från faktisk produkt. Vid avvikelse som påverkar ditt köpbeslut, kontakta oss innan du slutför beställningen.</p>
              <div className="mt-5 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                <p className="text-foreground/80">
                  <span className="font-semibold text-foreground">Allergener</span> anges på varje produktsida och på förpackningen. Det är kundens ansvar att kontrollera ingredienslistor innan köp. Frågor? Kontakta hello@plaently.com.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">10. Personuppgifter</h2>
              <p>Vi behandlar dina personuppgifter i enlighet med vår integritetspolicy och GDPR. Dina uppgifter används enbart för att genomföra och leverera din order samt för kommunikation kopplad till denna.</p>
              <Link to="/integritetspolicy" className="inline-block mt-3 text-primary font-medium hover:underline">Läs vår integritetspolicy →</Link>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">11. Cookies</h2>
              <p>Vi använder cookies på webbplatsen. Mer information finns i vår integritetspolicy och cookiepolicy.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">12. Immateriella rättigheter</h2>
              <p>Allt innehåll på plaently.com — text, bilder, logotyper, design och varumärket PLÄNTLY — ägs av PLÄNTLY AB och skyddas av upphovsrätt och varumärkesrätt. Innehållet får inte kopieras, reproduceras eller användas kommersiellt utan skriftligt tillstånd.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">13. Ansvarsbegränsning</h2>
              <p>PLÄNTLY AB ansvarar inte för skador som uppstår till följd av force majeure (strejk, naturkatastrof, pandemi, myndighetsbeslut), fel hos tredje part (fraktbolag, betaltjänst) eller obehörig användning av ditt konto. Vårt ansvar är i alla fall begränsat till värdet av din order.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">14. Tvistlösning</h2>
              <p>Vi strävar alltid efter att lösa tvister direkt med kunden. Om vi inte kan nå en överenskommelse kan du vända dig till:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="bg-background border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-bold text-foreground mb-2">Allmänna Reklamationsnämnden (ARN)</h3>
                  <p className="text-sm">Box 174, 101 23 Stockholm</p>
                  <p className="text-sm">www.arn.se</p>
                  <p className="text-sm mt-3">Vi åtar oss att delta i ARN:s prövning.</p>
                </div>
                <div className="bg-background border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-bold text-foreground mb-2">EU:s plattform för tvistlösning</h3>
                  <p className="text-sm">ec.europa.eu/consumers/odr</p>
                  <p className="text-sm mt-3">Alternativ för EU-baserade konsumenter.</p>
                </div>
              </div>
              <p className="mt-5"><span className="font-semibold text-foreground">Tillämplig lag:</span> Svensk lag. Tvist som inte löses via ARN avgörs i svensk domstol med Stockholms tingsrätt som första instans.</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">15. Kontakt</h2>
              <div className="bg-foreground text-primary-foreground rounded-2xl p-8 space-y-1">
                <p className="font-semibold">PLÄNTLY AB · Org.nr SE559400472201</p>
                <p className="text-primary-foreground/70">Vretensborgsvägen 5, 126 30 Hägersten</p>
                <p className="text-primary-foreground/70">hello@plaently.com · www.plaently.com</p>
                <p className="pt-3 text-primary-foreground/70">Kundtjänst svarar inom 24 timmar på vardagar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="bg-muted">
        <div className="container py-10">
          <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">
            Dessa villkor gäller från maj 2026 och ersätter tidigare versioner. Tillämplig lag: Distansavtalslagen (2005:59) och Konsumentköplagen (2022:260).
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;