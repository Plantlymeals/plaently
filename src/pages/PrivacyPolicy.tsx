import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Building2, Lock, Clock, FileText, Check } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

const COPY = {
  sv: {
    seoTitle: "Integritetspolicy — PLÄNTLY AB | Org.nr SE559400472201",
    seoDesc: "Hur PLÄNTLY AB hanterar dina personuppgifter i enlighet med GDPR och svensk lag.",
    label: "Integritetspolicy",
    h1: "Din integritet. Vår skyldighet.",
    sub: "Vi behandlar dina personuppgifter med respekt och full transparens, i enlighet med GDPR och svensk lag. Senast uppdaterad: maj 2026.",
    quick: [
      { icon: Building2, label: "Ansvarig", value: "PLÄNTLY AB" },
      { icon: Lock, label: "Krypterad data", value: "HTTPS/TLS" },
      { icon: Clock, label: "Svarstid", value: "24 timmar" },
      { icon: FileText, label: "Lagstiftning", value: "GDPR + IMY" },
    ],
    s1Title: "1. Personuppgiftsansvarig",
    s1Org: "PLÄNTLY AB",
    s1Lines: ["Org.nr: SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten, Sverige"],
    s1Email: "E-post: ",
    s1Web: "Webb: www.plaently.com",
    s1Body: "Vi är personuppgiftsansvariga för de personuppgifter vi samlar in om dig i samband med att du besöker vår webbplats, handlar i vår webbutik eller prenumererar på vårt nyhetsbrev.",
    s2Title: "2. Vilka uppgifter samlar vi in och varför",
    basisLabel: "Rättslig grund:",
    retentionLabel: "Lagringstid:",
    dataCards: [
      { title: "2.1 Vid köp", data: "Namn, e-post, leveransadress, fakturaadress, telefonnummer, orderhistorik. Kortuppgifter hanteras av tredjepartsaktör — vi lagrar inga.", basis: "Fullgörande av avtal (GDPR art. 6.1 b)", retention: "7 år (Bokföringslagen)" },
      { title: "2.2 Kundkonto", data: "Namn, e-post, lösenord (krypterat), orderhistorik.", basis: "Fullgörande av avtal (GDPR art. 6.1 b)", retention: "Så länge kontot är aktivt" },
      { title: "2.3 Nyhetsbrev", data: "E-post, datum/tid för samtycke, IP vid registrering.", basis: "Samtycke (GDPR art. 6.1 a) — återkallas när som helst", retention: "Tills avprenumeration eller begärd radering" },
      { title: "2.4 Kundtjänst", data: "Namn, e-post, meddelande.", basis: "Berättigat intresse (GDPR art. 6.1 f)", retention: "2 år efter avslutat ärende" },
    ],
    s3Title: "3. Hur vi använder dina uppgifter",
    usage: ["Genomföra och leverera din order", "Skicka orderbekräftelse och spårningsinformation", "Hantera returer, reklamationer och kundtjänstärenden", "Skicka nyhetsbrev — endast om du samtyckt", "Förbättra webbplatsen baserat på anonymiserad statistik", "Uppfylla rättsliga skyldigheter"],
    s3Bold: "Vi säljer aldrig dina uppgifter till tredje part.",
    s4Title: "4. Vilka delar vi uppgifterna med",
    partners: [
      { title: "Fraktpartners", body: "PostNord Sverige AB och DHL Express (Sweden) AB. Namn, leveransadress och telefonnummer för att genomföra leveransen." },
      { title: "Betaltjänst", body: "Klarna AB hanterar betalningen säkert. Vi lagrar inga kortuppgifter." },
      { title: "E-post & Analys", body: "E-postplattform + Google Analytics för nyhetsbrev, transaktionsmail och anonymiserad webbstatistik." },
    ],
    s4Note: "Alla tredjeparter är bundna av databehandlaravtal och får inte använda dina uppgifter för egna ändamål.",
    s5Title: "5. Överföring till tredje land",
    s5Body: "Vissa leverantörer kan lagra data utanför EU/EES. Vi säkerställer lämpliga skyddsåtgärder via EU-kommissionens standardavtalsklausuler (SCC).",
    s6Title: "6. Dina rättigheter",
    rights: [
      { title: "Tillgång (art. 15)", desc: "Begär utdrag av dina uppgifter" },
      { title: "Rättelse (art. 16)", desc: "Korrigering av felaktiga uppgifter" },
      { title: "Radering (art. 17)", desc: "”Rätten att bli bortglömd”" },
      { title: "Begränsning (art. 18)", desc: "Begränsad behandling" },
      { title: "Dataportabilitet (art. 20)", desc: "Uppgifter i maskinläsbart format" },
      { title: "Invändning (art. 21)", desc: "Mot behandling baserad på berättigat intresse" },
    ],
    s6CtaA: "Utöva dina rättigheter: skicka e-post till ",
    s6CtaB: " med ämnesraden ”GDPR-förfrågan”. Vi svarar inom 30 dagar.",
    s7Title: "7. Klagomål",
    s7Org: "Integritetsskyddsmyndigheten (IMY)",
    s7Lines: ["Box 8114, 104 20 Stockholm", "www.imy.se · imy@imy.se"],
    s7Body: "Vi hoppas att du vänder dig till oss direkt i första hand — vi löser gärna eventuella problem snabbt.",
    s8Title: "8. Cookies",
    cookies: [
      { title: "Nödvändiga cookies", desc: "Krävs för kassan och sessionshantering. Kan inte stängas av." },
      { title: "Analytiska cookies", desc: "Anonymiserad statistik. Kräver samtycke." },
      { title: "Marknadsföringscookies", desc: "Annonser på Meta och Google. Kräver samtycke." },
    ],
    s8Note: "Hantera dina inställningar via cookiebannern längst ned på sidan.",
    s9Title: "9. Säkerhet",
    security: ["All datatrafik krypteras med HTTPS/TLS", "Kortuppgifter hanteras aldrig av oss — all betalning via certifierade tjänster", "Åtkomst till personuppgifter begränsas till berörd personal"],
    s9Body: "Vid en personuppgiftsincident anmäler vi till IMY inom 72 timmar.",
    s10Title: "10. Ändringar",
    s10Body: "Den aktuella versionen finns alltid tillgänglig på plaently.com/integritetspolicy. Vid väsentliga förändringar informerar vi via e-post.",
    s11Title: "11. Kontakt",
    contactLines: ["PLÄNTLY AB · Org.nr SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten", "hello@plaently.com", "www.plaently.com"],
    footerNote: "Upprättad i enlighet med EU:s dataskyddsförordning (GDPR), Lag (2022:482) om elektronisk kommunikation samt IMY:s riktlinjer.",
  },
  en: {
    seoTitle: "Privacy Policy | PLÄNTLY",
    seoDesc: "How PLÄNTLY processes your personal data — in line with the GDPR and Swedish law. Full transparency on data, cookies and your rights.",
    label: "Privacy Policy",
    h1: "Your privacy. Our duty.",
    sub: "We handle your personal data with respect and full transparency, in line with the GDPR and Swedish law. Last updated: May 2026.",
    quick: [
      { icon: Building2, label: "Controller", value: "PLÄNTLY AB" },
      { icon: Lock, label: "Encrypted data", value: "HTTPS/TLS" },
      { icon: Clock, label: "Response time", value: "24 hours" },
      { icon: FileText, label: "Legislation", value: "GDPR + IMY" },
    ],
    s1Title: "1. Data controller",
    s1Org: "PLÄNTLY AB",
    s1Lines: ["Reg. no.: SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten, Sweden"],
    s1Email: "Email: ",
    s1Web: "Web: www.plaently.com",
    s1Body: "We are the data controller for the personal data we collect about you when you visit our website, shop in our store or subscribe to our newsletter.",
    s2Title: "2. What data we collect and why",
    basisLabel: "Legal basis:",
    retentionLabel: "Retention:",
    dataCards: [
      { title: "2.1 At purchase", data: "Name, email, delivery address, billing address, phone, order history. Card details are handled by a third-party provider — we store none.", basis: "Performance of contract (GDPR art. 6.1 b)", retention: "7 years (Swedish Bookkeeping Act)" },
      { title: "2.2 Customer account", data: "Name, email, password (encrypted), order history.", basis: "Performance of contract (GDPR art. 6.1 b)", retention: "As long as the account is active" },
      { title: "2.3 Newsletter", data: "Email, date/time of consent, IP at signup.", basis: "Consent (GDPR art. 6.1 a) — withdrawable anytime", retention: "Until unsubscribe or deletion request" },
      { title: "2.4 Customer service", data: "Name, email, message.", basis: "Legitimate interest (GDPR art. 6.1 f)", retention: "2 years after case closed" },
    ],
    s3Title: "3. How we use your data",
    usage: ["Process and deliver your order", "Send order confirmation and tracking", "Handle returns, complaints and customer service", "Send newsletters — only with your consent", "Improve the website with anonymized analytics", "Comply with legal obligations"],
    s3Bold: "We never sell your data to third parties.",
    s4Title: "4. Who we share data with",
    partners: [
      { title: "Shipping partners", body: "PostNord Sverige AB and DHL Express (Sweden) AB. Name, delivery address and phone to fulfil delivery." },
      { title: "Payments", body: "Klarna AB handles payments securely. We store no card details." },
      { title: "Email & Analytics", body: "Email platform + Google Analytics for newsletters, transactional emails and anonymized web stats." },
    ],
    s4Note: "All third parties are bound by data processing agreements and may not use your data for their own purposes.",
    s5Title: "5. Transfer to third countries",
    s5Body: "Some providers may store data outside the EU/EEA. We ensure appropriate safeguards via the EU Commission's Standard Contractual Clauses (SCC).",
    s6Title: "6. Your rights",
    rights: [
      { title: "Access (art. 15)", desc: "Request a copy of your data" },
      { title: "Rectification (art. 16)", desc: "Correction of inaccurate data" },
      { title: "Erasure (art. 17)", desc: "”Right to be forgotten”" },
      { title: "Restriction (art. 18)", desc: "Restricted processing" },
      { title: "Portability (art. 20)", desc: "Data in machine-readable format" },
      { title: "Objection (art. 21)", desc: "Against processing based on legitimate interest" },
    ],
    s6CtaA: "Exercise your rights: email ",
    s6CtaB: " with the subject ”GDPR request”. We respond within 30 days.",
    s7Title: "7. Complaints",
    s7Org: "Swedish Authority for Privacy Protection (IMY)",
    s7Lines: ["Box 8114, 104 20 Stockholm", "www.imy.se · imy@imy.se"],
    s7Body: "We hope you'll come to us first — we're happy to resolve any issues quickly.",
    s8Title: "8. Cookies",
    cookies: [
      { title: "Necessary cookies", desc: "Required for checkout and session handling. Cannot be disabled." },
      { title: "Analytics cookies", desc: "Anonymized statistics. Requires consent." },
      { title: "Marketing cookies", desc: "Ads on Meta and Google. Requires consent." },
    ],
    s8Note: "Manage your preferences via the cookie banner at the bottom of the page.",
    s9Title: "9. Security",
    security: ["All data traffic is encrypted with HTTPS/TLS", "Card details are never handled by us — payment via certified providers", "Access to personal data is restricted to relevant staff"],
    s9Body: "In case of a personal data breach, we report to IMY within 72 hours.",
    s10Title: "10. Changes",
    s10Body: "The current version is always available at plaently.com/integritetspolicy. We notify of material changes via email.",
    s11Title: "11. Contact",
    contactLines: ["PLÄNTLY AB · Reg. no. SE559400472201", "Vretensborgsvägen 5, 126 30 Hägersten", "hello@plaently.com", "www.plaently.com"],
    footerNote: "Prepared in accordance with the EU General Data Protection Regulation (GDPR), the Swedish Act (2022:482) on Electronic Communications and IMY's guidelines.",
  },
} as const;

const PrivacyPolicy = () => {
  const { lang, setLang } = useTranslation();
  const c = COPY["sv"];
  const path = "/integritetspolicy";

  useEffect(() => {
    if (lang !== "sv") setLang("sv");
  }, [lang, setLang]);

  const baseUrl = "https://plaently.com";
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
        inLanguage: "sv-SE",
        publisher: { "@id": `${baseUrl}/#organization` },
        dateModified: "2026-05-01",
      },
    ],
  };

  return (
    <Layout>
      <SEOHead title={c.seoTitle} description={c.seoDesc} path={path} type="article" jsonLd={jsonLd} locale="sv" noindex />

      <section className="bg-foreground text-primary-foreground">
        <div className="container py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{c.label}</p>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl tracking-tight mb-6">{c.h1}</h1>
          <p className="text-lg font-light text-primary-foreground/85 max-w-[520px] leading-relaxed">{c.sub}</p>
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
          <div className="max-w-[860px] mx-auto space-y-16 text-[16px] leading-[1.75] text-foreground/75 font-light">

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s1Title}</h2>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{c.s1Org}</p>
                {c.s1Lines.map((l) => <p key={l}>{l}</p>)}
                <p>{c.s1Email}<a href="mailto:hello@plaently.com" className="text-primary hover:underline">hello@plaently.com</a></p>
                <p>{c.s1Web}</p>
              </div>
              <p className="mt-5">{c.s1Body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s2Title}</h2>
              <div className="space-y-4">
                {c.dataCards.map((d) => (
                  <div key={d.title} className="border-l-4 border-primary bg-muted rounded-xl p-5 md:p-6">
                    <h3 className="font-heading font-bold text-foreground mb-2">{d.title}</h3>
                    <p className="mb-3">{d.data}</p>
                    <p className="text-sm"><span className="font-semibold text-foreground">{c.basisLabel}</span> {d.basis}</p>
                    <p className="text-sm"><span className="font-semibold text-foreground">{c.retentionLabel}</span> {d.retention}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s3Title}</h2>
              <ul className="space-y-3">
                {c.usage.map((u) => (
                  <li key={u} className="flex gap-3"><Check className="w-5 h-5 text-primary shrink-0 mt-1" /><span>{u}</span></li>
                ))}
              </ul>
              <p className="mt-6 font-semibold text-primary text-lg">{c.s3Bold}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s4Title}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {c.partners.map((p) => (
                  <div key={p.title} className="bg-background border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm">{p.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm">{c.s4Note}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s5Title}</h2>
              <p>{c.s5Body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s6Title}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {c.rights.map((r) => (
                  <div key={r.title} className="bg-background border border-border border-t-[3px] border-t-primary rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-foreground mb-1">{r.title}</h3>
                    <p className="text-sm">{r.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-primary text-primary-foreground rounded-2xl p-6">
                <p className="font-medium">{c.s6CtaA}<a href="mailto:hello@plaently.com" className="underline">hello@plaently.com</a>{c.s6CtaB}</p>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s7Title}</h2>
              <div className="border-l-4 border-primary bg-muted rounded-xl p-6 space-y-1">
                <p className="font-semibold text-foreground">{c.s7Org}</p>
                {c.s7Lines.map((l) => <p key={l}>{l}</p>)}
                <p className="pt-3">{c.s7Body}</p>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s8Title}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {c.cookies.map((ck) => (
                  <div key={ck.title} className="bg-background border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-foreground mb-2">{ck.title}</h3>
                    <p className="text-sm">{ck.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm">{c.s8Note}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s9Title}</h2>
              <ul className="space-y-3">
                {c.security.map((s) => (
                  <li key={s} className="flex gap-3"><Lock className="w-5 h-5 text-primary shrink-0 mt-1" /><span>{s}</span></li>
                ))}
              </ul>
              <p className="mt-5">{c.s9Body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s10Title}</h2>
              <p>{c.s10Body}</p>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl tracking-tight text-foreground mb-5">{c.s11Title}</h2>
              <div className="bg-foreground text-primary-foreground rounded-2xl p-8 space-y-1">
                {c.contactLines.map((l, i) => (
                  <p key={l} className={i === 0 ? "font-semibold" : "text-primary-foreground/70"}>{l}</p>
                ))}
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

export default PrivacyPolicy;