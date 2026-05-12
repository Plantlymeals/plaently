import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Building2, Lock, Clock, FileText, Check } from "lucide-react";

const PrivacyPolicy = () => {
  const quickInfo = [
    { icon: Building2, label: "Ansvarig", value: "PLÄNTLY AB" },
    { icon: Lock, label: "Krypterad data", value: "HTTPS/TLS" },
    { icon: Clock, label: "Svarstid", value: "24 timmar" },
    { icon: FileText, label: "Lagstiftning", value: "GDPR + IMY" },
  ];

  const dataCards = [
    {
      title: "2.1 Vid köp",
      data: "Namn, e-post, leveransadress, fakturaadress, telefonnummer, orderhistorik. Kortuppgifter hanteras av tredjepartsaktör — vi lagrar inga.",
      basis: "Fullgörande av avtal (GDPR art. 6.1 b)",
      retention: "7 år (Bokföringslagen)",
    },
    {
      title: "2.2 Kundkonto",
      data: "Namn, e-post, lösenord (krypterat), orderhistorik.",
      basis: "Fullgörande av avtal (GDPR art. 6.1 b)",
      retention: "Så länge kontot är aktivt",
    },
    {
      title: "2.3 Nyhetsbrev",
      data: "E-post, datum/tid för samtycke, IP vid registrering.",
      basis: "Samtycke (GDPR art. 6.1 a) — återkallas när som helst",
      retention: "Tills avprenumeration eller begärd radering",
    },
    {
      title: "2.4 Kundtjänst",
      data: "Namn, e-post, meddelande.",
      basis: "Berättigat intresse (GDPR art. 6.1 f)",
      retention: "2 år efter avslutat ärende",
    },
  ];

  const usage = [
    "Genomföra och leverera din order",
    "Skicka orderbekräftelse och spårningsinformation",
    "Hantera returer, reklamationer och kundtjänstärenden",
    "Skicka nyhetsbrev — endast om du samtyckt",
    "Förbättra webbplatsen baserat på anonymiserad statistik",
    "Uppfylla rättsliga skyldigheter",
  ];

  const partners = [
    {
      title: "Fraktpartners",
      body: "PostNord Sverige AB och DHL Express (Sweden) AB. Namn, leveransadress och telefonnummer för att genomföra leveransen.",
    },
    {
      title: "Betaltjänst",
      body: "Klarna AB hanterar betalningen säkert. Vi lagrar inga kortuppgifter.",
    },
    {
      title: "E-post & Analys",
      body: "E-postplattform + Google Analytics för nyhetsbrev, transaktionsmail och anonymiserad webbstatistik.",
    },
  ];

  const rights = [
    { title: "Tillgång (art. 15)", desc: "Begär utdrag av dina uppgifter" },
    { title: "Rättelse (art. 16)", desc: "Korrigering av felaktiga uppgifter" },
    { title: "Radering (art. 17)", desc: "”Rätten att bli bortglömd”" },
    { title: "Begränsning (art. 18)", desc: "Begränsad behandling" },
    { title: "Dataportabilitet (art. 20)", desc: "Uppgifter i maskinläsbart format" },
    { title: "Invändning (art. 21)", desc: "Mot behandling baserad på berättigat intresse" },
  ];

  const cookies = [
    { title: "Nödvändiga cookies", desc: "Krävs för kassan och sessionshantering. Kan inte stängas av." },
    { title: "Analytiska cookies", desc: "Anonymiserad statistik. Kräver samtycke." },
    { title: "Marknadsföringscookies", desc: "Annonser på Meta och Google. Kräver samtycke." },
  ];

  const security = [
    "All datatrafik krypteras med HTTPS/TLS",
    "Kortuppgifter hanteras aldrig av oss — all betalning via certifierade tjänster",
    "Åtkomst till personuppgifter begränsas till berörd personal",
  ];

  return (
    <Layout>
      <SEOHead
        title="Integritetspolicy | PLÄNTLY"
        description="Så här behandlar PLÄNTLY dina personuppgifter — i enlighet med GDPR och svensk lag. Full transparens om data, cookies och dina rättigheter."
        path="/integritetspolicy"
      />

      {/* HERO */}
      <section className="bg-foreground text-primary-foreground">
        <div className="container py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Integritetspolicy</p>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl tracking-tight mb-6">
            Din integritet. Vår skyldighet.
          </h1>
          <p className="text-lg font-light text-primary-foreground/55 max-w-[520px] leading-relaxed">
            Vi behandlar dina personuppgifter med respekt och full transparens, i enlighet med GDPR och svensk lag. Senast uppdaterad: maj 2026.
          </p>
        </div>
      </section>

      {/* QUICK INFO */}
      <section className="bg-muted">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickInfo.map((q) => (
              <div key={q.label} className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-2">
                <q.icon className="w-5 h-5 text-primary" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{q.label}</p>
                <p className="font-heading font-bold text-base">{q.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="bg-background">
        <div className="container py-16 md:py-20">
          <div className="max-w-[860px] mx-auto space-y-16 text-[16px] leading-[1.75] text-foreground/75 font-light">

            {/* 1 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">1. Personuppgiftsansvarig</h2>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">PLÄNTLY AB</p>
                <p>Org.nr: SE559400472201</p>
                <p>Vretensborgsvägen 5, 126 30 Hägersten, Sverige</p>
                <p>E-post: <a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a></p>
                <p>Webb: www.plaently.com</p>
              </div>
              <p className="mt-5">
                Vi är personuppgiftsansvariga för de personuppgifter vi samlar in om dig i samband med att du besöker vår webbplats, handlar i vår webbutik eller prenumererar på vårt nyhetsbrev.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">2. Vilka uppgifter samlar vi in och varför</h2>
              <div className="space-y-4">
                {dataCards.map((c) => (
                  <div key={c.title} className="border-l-4 border-primary bg-muted rounded-xl p-5 md:p-6">
                    <h3 className="font-heading font-bold text-foreground mb-2">{c.title}</h3>
                    <p className="mb-3">{c.data}</p>
                    <p className="text-sm"><span className="font-semibold text-foreground">Rättslig grund:</span> {c.basis}</p>
                    <p className="text-sm"><span className="font-semibold text-foreground">Lagringstid:</span> {c.retention}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">3. Hur vi använder dina uppgifter</h2>
              <ul className="space-y-3">
                {usage.map((u) => (
                  <li key={u} className="flex gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-semibold text-primary text-lg">Vi säljer aldrig dina uppgifter till tredje part.</p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">4. Vilka delar vi uppgifterna med</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {partners.map((p) => (
                  <div key={p.title} className="bg-background border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm">{p.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm">Alla tredjeparter är bundna av databehandlaravtal och får inte använda dina uppgifter för egna ändamål.</p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">5. Överföring till tredje land</h2>
              <p>Vissa leverantörer kan lagra data utanför EU/EES. Vi säkerställer lämpliga skyddsåtgärder via EU-kommissionens standardavtalsklausuler (SCC).</p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">6. Dina rättigheter</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {rights.map((r) => (
                  <div key={r.title} className="bg-background border border-border border-t-[3px] border-t-primary rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-foreground mb-1">{r.title}</h3>
                    <p className="text-sm">{r.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-primary text-primary-foreground rounded-2xl p-6">
                <p className="font-medium">
                  Utöva dina rättigheter: skicka e-post till <a href="mailto:hello@plaently.com" className="underline">hello@plaently.com</a> med ämnesraden ”GDPR-förfrågan”. Vi svarar inom 30 dagar.
                </p>
              </div>
            </div>

            {/* 7 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">7. Klagomål</h2>
              <div className="border-l-4 border-primary bg-muted rounded-xl p-6 space-y-1">
                <p className="font-semibold text-foreground">Integritetsskyddsmyndigheten (IMY)</p>
                <p>Box 8114, 104 20 Stockholm</p>
                <p>www.imy.se · imy@imy.se</p>
                <p className="pt-3">Vi hoppas att du vänder dig till oss direkt i första hand — vi löser gärna eventuella problem snabbt.</p>
              </div>
            </div>

            {/* 8 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">8. Cookies</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {cookies.map((c) => (
                  <div key={c.title} className="bg-background border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-foreground mb-2">{c.title}</h3>
                    <p className="text-sm">{c.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm">Hantera dina inställningar via cookiebannern längst ned på sidan.</p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">9. Säkerhet</h2>
              <ul className="space-y-3">
                {security.map((s) => (
                  <li key={s} className="flex gap-3">
                    <Lock className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5">Vid en personuppgiftsincident anmäler vi till IMY inom 72 timmar.</p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">10. Ändringar</h2>
              <p>Den aktuella versionen finns alltid tillgänglig på plaently.com/integritetspolicy. Vid väsentliga förändringar informerar vi via e-post.</p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">11. Kontakt</h2>
              <div className="bg-foreground text-primary-foreground rounded-2xl p-8 space-y-1">
                <p className="font-semibold">PLÄNTLY AB · Org.nr SE559400472201</p>
                <p className="text-primary-foreground/70">Vretensborgsvägen 5, 126 30 Hägersten</p>
                <p className="text-primary-foreground/70">hello@plaently.com</p>
                <p className="text-primary-foreground/70">www.plaently.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="bg-muted">
        <div className="container py-10">
          <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">
            Upprättad i enlighet med EU:s dataskyddsförordning (GDPR), Lag (2022:482) om elektronisk kommunikation samt IMY:s riktlinjer.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;