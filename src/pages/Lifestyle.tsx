import Layout from "@/components/Layout";
import { Briefcase, Dumbbell, Rocket, Utensils } from "lucide-react";

const personas = [
  {
    icon: Dumbbell,
    title: "Atleter & fitness",
    desc: "Driva din träning med 20g växtprotein per måltid. PLÄNTLY-måltider är designade för snabb återhämtning och uthållig energi, oavsett om du lyfter, springer eller tränar inför nästa tävling.",
  },
  {
    icon: Briefcase,
    title: "Kontor & företag",
    desc: "Uppgradera era arbetsplatsmåltider. PLÄNTLY kontorspaket håller teamen mätta med näringsrika, varma måltider — inget kök, ingen kock, inget krångel. Bara kokande vatten och 5 minuter.",
  },
  {
    icon: Rocket,
    title: "Entreprenörer & frilansare",
    desc: "När du bygger något har du inte tid för dålig mat. PLÄNTLY håller dig skärpt med balanserad näring som tar mindre tid än att beställa en kaffe.",
  },
  {
    icon: Utensils,
    title: "Vardaglig hälsosam mat",
    desc: "Alla har inte tid att laga tre mål om dagen. PLÄNTLY gör det enkelt att äta bra, även dina mest hektiska dagar. Riktig mat, riktigt protein, noll kompromisser.",
  },
];

const Lifestyle = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container space-y-16">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Byggd för alla livsstilar</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              PLÄNTLY passar in i ditt liv, inte tvärtom.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {personas.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-card border border-border/50 p-8 shadow-card space-y-4 animate-fade-up hover:shadow-elevated transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-semibold">{title}</h2>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Lifestyle;
