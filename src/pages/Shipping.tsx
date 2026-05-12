import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Shipping = () => {
  const tableRows = [
    { order: "Enstaka kopp", content: "1–3 koppar", cost: "49 kr", time: "2–4 vardagar", free: false },
    { order: "Trial Pack", content: "4 koppar", cost: "49 kr", time: "2–4 vardagar", free: false },
    { order: "Starter Pack ⭐", content: "12 koppar (399 kr)", cost: "Gratis", time: "2–4 vardagar", free: true },
    { order: "Monthly Box", content: "30 koppar", cost: "Gratis", time: "2–4 vardagar", free: true },
  ];

  const steps = [
    { n: "1", title: "Du beställer", desc: "Order bekräftas direkt via e-post." },
    { n: "2", title: "Vi packar", desc: "Samma dag (beställn. innan kl. 12.00 vardagar)." },
    { n: "3", title: "Spårningsnr.", desc: "Du får ett spårningsnummer via e-post." },
    { n: "4", title: "Leverans", desc: "2–4 vardagar. Hela Sverige." },
    { n: "🌱", title: "Njut!", desc: "Tillsätt vatten. Klart på 5 min." },
  ];

  const issues = [
    { icon: "📦", title: "Försenad leverans", text: "Om din order inte anlänt inom 7 vardagar från beräknat leveransdatum, hör av dig till oss. Vi spårar paketet och löser det.", cta: "Kontakta oss →" },
    { icon: "💔", title: "Skadad produkt", text: "Fick du en skadad förpackning? Ta ett foto och skicka till hello@plaently.com inom 14 dagar. Vi skickar ny order utan extra kostnad.", cta: "Skicka foto →" },
    { icon: "🔄", title: "Fel order", text: "Fick du fel produkter? Kontakta oss — vi rättar felet och bekräftar ny leverans inom 24 timmar på vardagar.", cta: "Rätta order →" },
  ];

  const rights = [
    { title: "Ångerrätt — 14 dagar", text: "Du har 14 dagars ångerrätt från att du mottagit din order, enligt Distansavtalslagen. Eftersom våra produkter är livsmedel gäller ångerrätten inte om förpackningen öppnats (hygien- och säkerhetsskäl). Oöppnade produkter returneras på köparens bekostnad." },
    { title: "Reklamationsrätt — 3 år", text: "Som konsument har du 3 års reklamationsrätt enligt Konsumentköplagen. Kontakta oss på hello@plaently.com om du har klagomål på en produkt." },
    { title: "Leveransansvar", text: "PLÄNTLY ansvarar för att din order levereras i rätt skick. Vid skada eller förlust under transport ersätter vi ordern utan kostnad. Du behöver aldrig stå för felet." },
    { title: "Tvistlösning", text: "Om vi inte kan lösa en tvist direkt kan du vända dig till Allmänna Reklamationsnämnden (ARN) på arn.se. Vi åtar oss att delta i ARN:s prövning." },
  ];

  const faqs = [
    { q: "Kan jag ändra leveransadress efter beställning?", a: "Kontakta oss på hello@plaently.com snarast möjligt. Vi kan ändra adressen om ordern inte redan skickats. Inkludera ditt ordernummer i mailet." },
    { q: "Levererar ni till Svalbard, Åland eller utlandet?", a: "Just nu levererar vi endast inom Sverige. Vi arbetar på att utöka leveransen till Norge, Danmark och Finland. Anmäl dig till vårt nyhetsbrev för att vara först med att veta!" },
    { q: "Vad händer om ingen är hemma vid leverans?", a: "PostNord och DHL lämnar ett avi eller levererar till närmaste utlämningsställe/paketbox. Du får ett SMS/e-post med instruktioner för upphämtning." },
    { q: "Hur spårar jag min order?", a: "Du får ett spårningsnummer via e-post så fort ordern är avsänd. Använd det på PostNord.se eller DHL.se för att se realtidsstatus." },
    { q: "Kan jag kombinera produkter för att nå fri frakt?", a: "Ja! Alla beställningar över 399 kr får fri frakt automatiskt i kassan — oavsett vilka produkter du väljer." },
    { q: "Hur länge håller produkterna?", a: "Alla PLÄNTLY-produkter har lång hållbarhet — minst 12 månader från tillverkningsdatum. Bäst-före-datum finns tryckt på varje kopp." },
  ];

  return (
    <Layout>
      <SEOHead
        title="Frakt & Leverans — PLÄNTLY"
        description="Fri frakt över 399 kr. Vi skickar med PostNord och DHL inom 2–4 vardagar. Spårning, ångerrätt och reklamation enligt svensk lag."
        path="/shipping"
      />

      {/* 1. HERO */}
      <section className="bg-foreground text-background py-20 md:py-28">
        <div className="container max-w-4xl text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Frakt & Leverans</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Enkelt, snabbt och <span className="text-primary">transparent.</span>
          </h1>
          <p className="text-lg font-light text-background/55 max-w-2xl mx-auto">
            Vi skickar dina PLÄNTLY-måltider med PostNord och DHL. Du får ett spårningsnummer så fort din order är på väg.
          </p>
        </div>
      </section>

      {/* 2. FREE SHIPPING BANNER */}
      <section className="bg-primary py-5">
        <div className="container text-center">
          <p className="text-primary-foreground font-bold text-base md:text-lg">
            🚚 Fri frakt på alla beställningar över 399 kr — alltid.
          </p>
        </div>
      </section>

      {/* 3. FRAKTKOSTNADER */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl space-y-10">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Fraktkostnader</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Vad kostar frakten?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gratis frakt på Starter Pack och Monthly Box. Enstaka koppar tillkommer en fraktavgift.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-foreground text-background">
                  {["Order", "Innehåll", "Fraktkostnad", "Leveranstid"].map((h) => (
                    <th key={h} className="px-4 md:px-6 py-4 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => (
                  <tr key={i} className="border-t border-border bg-card hover:bg-primary/5 transition-colors">
                    <td className="px-4 md:px-6 py-5 font-medium">{r.order}</td>
                    <td className="px-4 md:px-6 py-5 text-muted-foreground">{r.content}</td>
                    <td className="px-4 md:px-6 py-5">
                      {r.free ? (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-primary/10 border border-primary/25 text-primary">
                          ✓ Gratis
                        </span>
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

      {/* 4. FRAKTPARTNERS */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-5xl space-y-10">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Fraktpartners</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Vi skickar med PostNord & DHL</h2>
            <p className="text-muted-foreground">Välj den leveransmetod som passar dig bäst i kassan.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "📦", iconBg: "bg-orange-100", title: "PostNord", desc: "Leverans till din brevlåda, dörren eller närmaste paketbox. Täcker hela Sverige — även glesbygd. Du väljer leveransplats i kassan.", tag: "Standardalternativ" },
              { icon: "🚀", iconBg: "bg-yellow-100", title: "DHL", desc: "Snabbare leverans med DHL:s nätverk. Leverans till dörren eller DHL ServicePoint. Bra alternativ om du vill ha paketet lite snabbare.", tag: "Snabbalternativ" },
            ].map((c) => (
              <div key={c.title} className="rounded-[18px] border border-border bg-card p-8 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-elevated">
                <div className={`w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center text-2xl mb-5`}>{c.icon}</div>
                <h3 className="font-heading font-bold text-lg mb-3">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.desc}</p>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LEVERANSPROCESS */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Leveransprocess</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Från beställning till dörren</h2>
            <p className="text-muted-foreground">Beställningar lagda innan kl. 12.00 på vardagar skickas samma dag.</p>
          </div>
          <div className="relative grid md:grid-cols-5 gap-8">
            <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-primary/20" />
            {steps.map((s) => (
              <div key={s.title} className="relative text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-xl shadow-card relative z-10">
                  {s.n}
                </div>
                <h3 className="font-heading font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OM NÅGOT GÅR FEL */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-6xl space-y-10">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Problem med din order?</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Vi löser det — alltid.</h2>
            <p className="text-muted-foreground">
              Kontakta oss på <a href="mailto:hello@plaently.com" className="text-primary font-medium hover:underline">hello@plaently.com</a> så återkommer vi inom 24 timmar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {issues.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-7 space-y-4">
                <div className="text-3xl">{c.icon}</div>
                <h3 className="font-heading font-bold text-lg">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                <a href="mailto:hello@plaently.com" className="inline-flex text-sm font-semibold text-primary hover:underline">{c.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. JURIDIK */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl space-y-10">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dina rättigheter</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Konsumentskydd & ångerrätt</h2>
            <p className="text-muted-foreground">Vi följer svensk konsumentlagstiftning och EU:s e-handelsdirektiv fullt ut.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {rights.map((r) => (
              <div key={r.title} className="rounded-[14px] border border-border border-l-4 border-l-primary bg-card p-7 space-y-3">
                <h3 className="font-heading font-bold text-lg">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-3xl space-y-10">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Vanliga frågor</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Frakt-FAQ</h2>
            <p className="text-muted-foreground">
              Hittar du inte svaret? Maila <a href="mailto:hello@plaently.com" className="text-primary font-medium hover:underline">hello@plaently.com</a>
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/35">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="py-20 gradient-hero">
        <div className="container max-w-3xl text-center space-y-6 text-primary-foreground">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Redo att beställa?</h2>
          <p className="text-primary-foreground/75 text-lg">
            Fri frakt på alla beställningar över 399 kr. Levereras till din dörr på 2–4 vardagar.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 font-semibold bg-background text-foreground hover:bg-background/90">
            <Link to="/products">Handla Starter Pack → 🌱</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Shipping;
