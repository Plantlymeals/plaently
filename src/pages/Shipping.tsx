import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/lib/i18n";
import { Package, Truck, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import { MARKETS, marketLabel, type Market } from "@/lib/markets";
import { useMarketStore } from "@/stores/marketStore";

const PARTNER_ICONS: Record<string, typeof Package> = { PostNord: Package, DHL: Truck };
const ISSUE_ICONS = [Clock, AlertTriangle, RotateCcw];

const COPY = {
 sv: {
 seoTitle: "Frakt & Leverans — PLÄNTLY",
 seoDesc: "Fri frakt från 399 kr. Vi skickar med PostNord och DHL inom 1-2\u00a0vardagar. Spårning, ångerrätt och reklamation enligt svensk lag.",
 label: "Frakt & Leverans",
 h1a: "Enkelt, snabbt och ",
 h1b: "transparent.",
 heroSub: "Vi skickar dina PLÄNTLY-måltider med PostNord och DHL. Du får ett spårningsnummer så fort din order är på väg.",
 banner: " Fri frakt på alla beställningar från 399 kr — alltid.",
 costsLabel: "Fraktkostnader",
 costsTitle: "Vad kostar frakten?",
 costsSub: "Gratis frakt på Starter Pack och Monthly Box. Enstaka koppar tillkommer en fraktavgift.",
 th: ["Order", "Innehåll", "Fraktkostnad", "Leveranstid"],
 free: " Gratis",
  tableRows: [
  { order: "Enstaka kopp", content: "1–3 koppar", cost: "49 kr", time: "1-2\u00a0vardagar", free: false },
  { order: "Trial Pack", content: "4 koppar", cost: "49 kr", time: "1-2\u00a0vardagar", free: false },
  { order: "Starter Pack", content: "12 koppar (399 kr)", cost: "Gratis", time: "1-2\u00a0vardagar", free: true },
  { order: "Monthly Box", content: "24 koppar", cost: "Gratis", time: "1-2\u00a0vardagar", free: true },
  ],
 partnersLabel: "Fraktpartners",
 partnersTitle: "Vi skickar med PostNord & DHL",
 partnersSub: "Välj den leveransmetod som passar dig bäst i kassan.",
 partners: [
 { icon: "", iconBg: "bg-orange-100", title: "PostNord", desc: "Leverans till din brevlåda, dörren eller närmaste paketbox. Täcker hela Sverige — även glesbygd. Du väljer leveransplats i kassan.", tag: "Standardalternativ" },
 { icon: "", iconBg: "bg-yellow-100", title: "DHL", desc: "Snabbare leverans med DHL:s nätverk. Leverans till dörren eller DHL ServicePoint. Bra alternativ om du vill ha paketet lite snabbare.", tag: "Snabbalternativ" },
 ],
 processLabel: "Leveransprocess",
 processTitle: "Från beställning till dörren",
 processSub: "Beställningar lagda innan kl. 12.00 på vardagar skickas samma dag.",
 steps: [
 { n: "1", title: "Du beställer", desc: "Order bekräftas direkt via e-post." },
 { n: "2", title: "Vi packar", desc: "Samma dag (beställn. innan kl. 12.00 vardagar)." },
 { n: "3", title: "Spårningsnr.", desc: "Du får ett spårningsnummer via e-post." },
 { n: "4", title: "Leverans", desc: "1-2\u00a0vardagar. Hela Sverige." },
 { n: "5", title: "Njut!", desc: "Tillsätt vatten. Klart på 5 min." },
 ],
 issuesLabel: "Problem med din order?",
 issuesTitle: "Vi löser det — alltid.",
 issuesSub1: "Kontakta oss på ",
 issuesSub2: " så återkommer vi inom 24 timmar.",
 issues: [
 { icon: "", title: "Försenad leverans", text: "Om din order inte anlänt inom 7 vardagar från beräknat leveransdatum, hör av dig till oss. Vi spårar paketet och löser det.", cta: "Kontakta oss" },
 { icon: "", title: "Skadad produkt", text: "Fick du en skadad förpackning? Ta ett foto och skicka till hello@plaently.com inom 14 dagar. Vi skickar ny order utan extra kostnad.", cta: "Skicka foto" },
 { icon: "", title: "Fel order", text: "Fick du fel produkter? Kontakta oss — vi rättar felet och bekräftar ny leverans inom 24 timmar på vardagar.", cta: "Rätta order" },
 ],
 rightsLabel: "Dina rättigheter",
 rightsTitle: "Konsumentskydd & ångerrätt",
 rightsSub: "Vi följer svensk konsumentlagstiftning och EU:s e-handelsdirektiv fullt ut.",
 rights: [
 { title: "Ångerrätt — 14 dagar", text: "Du har 14 dagars ångerrätt från att du mottagit din order, enligt Distansavtalslagen. Eftersom våra produkter är livsmedel gäller ångerrätten inte om förpackningen öppnats (hygien- och säkerhetsskäl). Oöppnade produkter returneras på köparens bekostnad." },
 { title: "Reklamationsrätt — 3 år", text: "Som konsument har du 3 års reklamationsrätt enligt Konsumentköplagen. Kontakta oss på hello@plaently.com om du har klagomål på en produkt." },
 { title: "Leveransansvar", text: "PLÄNTLY ansvarar för att din order levereras i rätt skick. Vid skada eller förlust under transport ersätter vi ordern utan kostnad. Du behöver aldrig stå för felet." },
 { title: "Tvistlösning", text: "Om vi inte kan lösa en tvist direkt kan du vända dig till Allmänna Reklamationsnämnden (ARN) på arn.se. Vi åtar oss att delta i ARN:s prövning." },
 ],
 faqLabel: "Vanliga frågor",
 faqTitle: "Frakt-FAQ",
 faqSub1: "Hittar du inte svaret? Maila ",
 faqSub2: "",
 faqs: [
 { q: "Kan jag ändra leveransadress efter beställning?", a: "Kontakta oss på hello@plaently.com snarast möjligt. Vi kan ändra adressen om ordern inte redan skickats. Inkludera ditt ordernummer i mailet." },
 { q: "Levererar ni till Svalbard, Åland eller utlandet?", a: "Just nu levererar vi endast inom Sverige. Vi arbetar på att utöka leveransen till Norge, Danmark och Finland. Anmäl dig till vårt nyhetsbrev för att vara först med att veta!" },
 { q: "Vad händer om ingen är hemma vid leverans?", a: "PostNord och DHL lämnar ett avi eller levererar till närmaste utlämningsställe/paketbox. Du får ett SMS/e-post med instruktioner för upphämtning." },
 { q: "Hur spårar jag min order?", a: "Du får ett spårningsnummer via e-post så fort ordern är avsänd. Använd det på PostNord.se eller DHL.se för att se realtidsstatus." },
 { q: "Kan jag kombinera produkter för att nå fri frakt?", a: "Ja! Alla beställningar från 399 kr får fri frakt automatiskt i kassan — oavsett vilka produkter du väljer." },
 { q: "Hur länge håller produkterna?", a: "Alla PLÄNTLY-produkter har lång hållbarhet — minst 12 månader från tillverkningsdatum. Bäst-före-datum finns tryckt på varje kopp." },
 ],
 ctaTitle: "Redo att beställa?",
 ctaSub: "Fri frakt på alla beställningar från 399 kr. Levereras till din dörr på 1-2\u00a0vardagar.",
 ctaBtn: "Handla Starter Pack",
 },
 en: {
 seoTitle: "Shipping & Delivery — PLÄNTLY",
 seoDesc: "Free shipping from SEK 399. We ship with PostNord and DHL within 1-2 business days. Tracking, right of withdrawal and complaints under Swedish law.",
 label: "Shipping & Delivery",
 h1a: "Simple, fast and ",
 h1b: "transparent.",
 heroSub: "We ship your PLÄNTLY meals with PostNord and DHL. You'll get a tracking number as soon as your order is on its way.",
 banner: " Free shipping on all orders from SEK 399 — always.",
 costsLabel: "Shipping costs",
 costsTitle: "What does shipping cost?",
 costsSub: "Free shipping on Starter Pack and Monthly Box. Single cups have a small shipping fee.",
 th: ["Order", "Contents", "Shipping", "Delivery time"],
 free: " Free",
  tableRows: [
  { order: "Single cup", content: "1–3 cups", cost: "SEK 49", time: "1-2 business days", free: false },
  { order: "Trial Pack", content: "4 cups", cost: "SEK 49", time: "1-2 business days", free: false },
  { order: "Starter Pack", content: "12 cups (SEK 399)", cost: "Free", time: "1-2 business days", free: true },
  { order: "Monthly Box", content: "24 cups", cost: "Free", time: "1-2 business days", free: true },
  ],
 partnersLabel: "Shipping partners",
 partnersTitle: "We ship with PostNord & DHL",
 partnersSub: "Choose the delivery method that suits you best at checkout.",
 partners: [
 { icon: "", iconBg: "bg-orange-100", title: "PostNord", desc: "Delivery to your mailbox, door or nearest pickup point. Covers all of Sweden — including rural areas. Choose your pickup point at checkout.", tag: "Standard option" },
 { icon: "", iconBg: "bg-yellow-100", title: "DHL", desc: "Faster delivery via DHL's network. Door delivery or DHL ServicePoint. A good option if you want your parcel a bit faster.", tag: "Express option" },
 ],
 processLabel: "Delivery process",
 processTitle: "From order to doorstep",
 processSub: "Orders placed before 12:00 noon on weekdays ship the same day.",
 steps: [
 { n: "1", title: "You order", desc: "Order confirmed instantly via email." },
 { n: "2", title: "We pack", desc: "Same day (orders before 12:00 on weekdays)." },
 { n: "3", title: "Tracking", desc: "You get a tracking number via email." },
 { n: "4", title: "Delivery", desc: "1-2 business days. All of Sweden." },
 { n: "5", title: "Enjoy!", desc: "Just add water. Ready in 5 min." },
 ],
 issuesLabel: "Problem with your order?",
 issuesTitle: "We'll fix it — always.",
 issuesSub1: "Contact us at ",
 issuesSub2: " and we'll get back within 24 hours.",
 issues: [
 { icon: "", title: "Late delivery", text: "If your order hasn't arrived within 7 business days of the estimated delivery date, get in touch. We'll track the parcel and resolve it.", cta: "Contact us" },
 { icon: "", title: "Damaged product", text: "Got a damaged package? Take a photo and send it to hello@plaently.com within 14 days. We'll ship a new order at no extra cost.", cta: "Send photo" },
 { icon: "", title: "Wrong order", text: "Got the wrong products? Contact us — we'll correct the mistake and confirm a new delivery within 24 hours on weekdays.", cta: "Fix order" },
 ],
 rightsLabel: "Your rights",
 rightsTitle: "Consumer protection & withdrawal",
 rightsSub: "We fully comply with Swedish consumer law and the EU e-commerce directive.",
 rights: [
 { title: "Right of withdrawal — 14 days", text: "You have 14 days' right of withdrawal from receiving your order, under the Swedish Distance Contracts Act. Since our products are food, the right does not apply once the package has been opened (hygiene and safety). Unopened products are returned at the buyer's expense." },
 { title: "Complaint right — 3 years", text: "As a consumer, you have a 3-year complaint right under the Swedish Consumer Sales Act. Contact us at hello@plaently.com if you have a complaint about a product." },
 { title: "Delivery responsibility", text: "PLÄNTLY is responsible for delivering your order in good condition. In case of damage or loss in transit, we replace the order at no cost. You never carry the risk." },
 { title: "Dispute resolution", text: "If we can't resolve a dispute directly, you can contact the Swedish National Board for Consumer Disputes (ARN) at arn.se. We commit to participating in ARN's review." },
 ],
 faqLabel: "FAQ",
 faqTitle: "Shipping FAQ",
 faqSub1: "Can't find your answer? Email ",
 faqSub2: "",
 faqs: [
 { q: "Can I change my delivery address after ordering?", a: "Contact us at hello@plaently.com as soon as possible. We can change the address if the order hasn't shipped yet. Include your order number in the email." },
 { q: "Do you deliver to Svalbard, Åland or abroad?", a: "We currently only deliver within Sweden. We're working on expanding to Norway, Denmark and Finland. Sign up for our newsletter to be the first to know!" },
 { q: "What happens if no one is home at delivery?", a: "PostNord and DHL leave a notice or deliver to the nearest pickup point/parcel locker. You'll get an SMS/email with pickup instructions." },
 { q: "How do I track my order?", a: "You'll get a tracking number via email as soon as the order ships. Use it on PostNord.se or DHL.se to see real-time status." },
 { q: "Can I combine products to reach free shipping?", a: "Yes! All orders from SEK 399 get free shipping automatically at checkout — no matter which products you choose." },
 { q: "How long do the products last?", a: "All PLÄNTLY products have a long shelf life — at least 12 months from production date. The best-before date is printed on every cup." },
 ],
 ctaTitle: "Ready to order?",
 ctaSub: "Free shipping on all orders from SEK 399. Delivered to your door in 1-2 business days.",
 ctaBtn: "Shop Starter Pack",
 },
} as const;

const Shipping = () => {
 const { lang } = useTranslation();
 const c = COPY[lang === "sv" ? "sv" : "en"];
 const isEn = lang !== "sv";
  const currentMarket = useMarketStore((s) => s.market);
  const setMarket = useMarketStore((s) => s.setMarket);
  const compareTitle = isEn ? "Shipping by market" : "Frakt per marknad";
  const compareSub = isEn
    ? "We ship to Sweden, the EU and the United Kingdom. Tap a market to see your pricing."
    : "Vi levererar till Sverige, EU och Storbritannien. Tryck på en marknad för att se ditt pris.";
  const yourMarket = isEn ? "Your market" : "Din marknad";
  const standardLabel = isEn ? "Standard shipping" : "Standardfrakt";
  const freeOverLabel = isEn ? "Free shipping from" : "Fri frakt från";
 const path = isEn ? "/shipping" : "/frakt";
 const alternates = [
   { hreflang: "en", path: "/shipping" },
   { hreflang: "sv", path: "/frakt" },
   { hreflang: "x-default", path: "/shipping" },
 ];

 return (
 <Layout>
 <SEOHead title={c.seoTitle} description={c.seoDesc} path={path} locale={isEn ? "en" : "sv"} alternates={alternates} />

 <section className="bg-foreground text-background py-20 md:py-28">
 <div className="container max-w-4xl text-center space-y-6">
 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.label}</p>
 <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
 {c.h1a}<span className="text-primary">{c.h1b}</span>
 </h1>
 <p className="text-lg font-light text-background/55 max-w-2xl mx-auto">{c.heroSub}</p>
 </div>
 </section>

 <section className="bg-primary py-5">
 <div className="container text-center">
 <p className="text-primary-foreground font-bold text-base md:text-lg">{c.banner}</p>
 </div>
 </section>

      <section className="pt-8">
        <div className="container">
          <Breadcrumbs
            items={[{ label: isEn ? "Shipping" : "Frakt", path }]}
            lang={isEn ? "en" : "sv"}
            className="mb-0"
          />
        </div>
      </section>

  <section className="py-16 bg-background">
    <div className="container max-w-5xl space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-heading text-3xl md:text-4xl font-bold">{compareTitle}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{compareSub}</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {(Object.keys(MARKETS) as Market[]).map((m) => {
          const cfg = MARKETS[m];
          const active = currentMarket === m;
          return (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={`text-left rounded-2xl border p-6 transition-all ${
                active
                  ? "border-primary bg-primary/5 shadow-elevated"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl leading-none">{cfg.flag}</span>
                {active && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2 py-1">
                    {yourMarket}
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-lg mb-3">{marketLabel(m, isEn ? "en" : "sv")}</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{standardLabel}</dt>
                  <dd className="font-semibold">{cfg.shippingCost} {cfg.currency}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{freeOverLabel}</dt>
                  <dd className="font-semibold text-primary">{cfg.freeShippingThreshold} {cfg.currency}</dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>
    </div>
  </section>

 <section className="py-20 bg-background">
 <div className="container max-w-5xl space-y-10">
 <div className="text-center space-y-4">
 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.costsLabel}</p>
 <h2 className="font-heading text-3xl md:text-4xl font-bold">{c.costsTitle}</h2>
 <p className="text-muted-foreground max-w-2xl mx-auto">{c.costsSub}</p>
 </div>
 <div className="overflow-hidden rounded-2xl border border-border shadow-card">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-foreground text-background">
 {c.th.map((h) => (
 <th key={h} className="px-4 md:px-6 py-4 text-xs font-semibold uppercase tracking-wider">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {c.tableRows.map((r, i) => (
 <tr key={i} className="border-t border-border bg-card hover:bg-primary/5 transition-colors">
 <td className="px-4 md:px-6 py-5 font-medium">{r.order}</td>
 <td className="px-4 md:px-6 py-5 text-muted-foreground">{r.content}</td>
 <td className="px-4 md:px-6 py-5">
 {r.free ? (
 <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-primary/10 border border-primary/25 text-primary">{c.free}</span>
 ) : (
 <span className="font-bold">{r.cost}</span>
 )}
 </td>
 <td className="px-4 md:px-6 py-5 text-muted-foreground">{r.time}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </section>

 <section className="py-20 bg-muted/30">
 <div className="container max-w-5xl space-y-10">
 <div className="text-center space-y-4">
 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.partnersLabel}</p>
 <h2 className="font-heading text-3xl md:text-4xl font-bold">{c.partnersTitle}</h2>
 <p className="text-muted-foreground">{c.partnersSub}</p>
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 {c.partners.map((p) => (
 <div key={p.title} className="rounded-[18px] border border-border bg-card p-8 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-elevated">
 <div className={`w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center mb-5`}>{(() => { const Icon = PARTNER_ICONS[p.title] || Package; return <Icon className="h-6 w-6 text-foreground" />; })()}</div>
 <h3 className="font-heading font-bold text-lg mb-3">{p.title}</h3>
 <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>
 <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary">{p.tag}</span>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section className="py-20 bg-background">
 <div className="container max-w-6xl space-y-12">
 <div className="text-center space-y-4">
 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.processLabel}</p>
 <h2 className="font-heading text-3xl md:text-4xl font-bold">{c.processTitle}</h2>
 <p className="text-muted-foreground">{c.processSub}</p>
 </div>
 <div className="relative grid md:grid-cols-5 gap-8">
 <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-primary/20" />
 {c.steps.map((s) => (
 <div key={s.title} className="relative text-center space-y-3">
 <div className="mx-auto w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-xl shadow-card relative z-10">{s.n}</div>
 <h3 className="font-heading font-semibold">{s.title}</h3>
 <p className="text-sm text-muted-foreground">{s.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section className="py-20 bg-muted/30">
 <div className="container max-w-6xl space-y-10">
 <div className="text-center space-y-4">
 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.issuesLabel}</p>
 <h2 className="font-heading text-3xl md:text-4xl font-bold">{c.issuesTitle}</h2>
 <p className="text-muted-foreground">
 {c.issuesSub1}<a href="mailto:hello@plaently.com" className="text-primary font-medium hover:underline">hello@plaently.com</a>{c.issuesSub2}
 </p>
 </div>
 <div className="grid md:grid-cols-3 gap-6">
 {c.issues.map((i, idx) => (
 <div key={i.title} className="rounded-2xl border border-border bg-card p-7 space-y-4">
 <div className="text-primary">{(() => { const Icon = ISSUE_ICONS[idx] || Clock; return <Icon className="h-7 w-7" />; })()}</div>
 <h3 className="font-heading font-bold text-lg">{i.title}</h3>
 <p className="text-sm text-muted-foreground leading-relaxed">{i.text}</p>
 <a href="mailto:hello@plaently.com" className="inline-flex text-sm font-semibold text-primary hover:underline">{i.cta}</a>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section className="py-20 bg-background">
 <div className="container max-w-5xl space-y-10">
 <div className="text-center space-y-4">
 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.rightsLabel}</p>
 <h2 className="font-heading text-3xl md:text-4xl font-bold">{c.rightsTitle}</h2>
 <p className="text-muted-foreground">{c.rightsSub}</p>
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 {c.rights.map((r) => (
 <div key={r.title} className="rounded-[14px] border border-border border-l-4 border-l-primary bg-card p-7 space-y-3">
 <h3 className="font-heading font-bold text-lg">{r.title}</h3>
 <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section className="py-20 bg-muted/30">
 <div className="container max-w-3xl space-y-10">
 <div className="text-center space-y-4">
 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{c.faqLabel}</p>
 <h2 className="font-heading text-3xl md:text-4xl font-bold">{c.faqTitle}</h2>
 <p className="text-muted-foreground">
 {c.faqSub1}<a href="mailto:hello@plaently.com" className="text-primary font-medium hover:underline">hello@plaently.com</a>
 </p>
 </div>
 <Accordion type="single" collapsible className="space-y-3">
 {c.faqs.map((f, i) => (
 <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/35">
 <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
 <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
 </AccordionItem>
 ))}
 </Accordion>
 </div>
 </section>

 <section className="py-20 gradient-hero">
 <div className="container max-w-3xl text-center space-y-6 text-primary-foreground">
 <h2 className="font-heading text-3xl md:text-4xl font-bold">{c.ctaTitle}</h2>
 <p className="text-primary-foreground/75 text-lg">{c.ctaSub}</p>
 <Button asChild size="lg" className="rounded-full px-8 font-semibold bg-background text-foreground hover:bg-background/90">
 <Link to="/products">{c.ctaBtn}</Link>
 </Button>
 </div>
 </section>
 </Layout>
 );
};

export default Shipping;