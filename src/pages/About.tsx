import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Om PLÄNTLY</h1>
            <p className="text-muted-foreground text-lg">Växtbaserade proteinmåltider — enkelt, gott och hållbart för det moderna livet.</p>
          </div>

          <div className="space-y-8 text-muted-foreground leading-relaxed animate-fade-up">
            <p>PLÄNTLY föddes i Skandinavien ur en enkel frustration: varför är det så svårt att äta bra när man har ont om tid? Snabbmat är ofta skräp, och hälsosam mat tar tid som de flesta inte har.</p>
            <p>Vi bestämde oss för att skapa något annorlunda — riktiga måltider, med riktigt protein, från riktiga växter. Inga pulver, inga shakes, inga kompromisser. Bara mat som är lika bra för dig som den smakar, klar på tiden det tar att koka vatten.</p>
            <p>Vårt team av kockar och nutritionister lade över ett år på att utveckla recept som levererar 20g växtprotein per portion, med balanserade makron, ärliga ingredienser och smaker man faktiskt längtar efter.</p>
            <p>Idag litar atleter, kontor, entreprenörer och alla som vägrar välja mellan hälsa och bekvämlighet på PLÄNTLY. Vi är på uppdrag att göra växtbaserat protein till det enklaste valet för det moderna livet.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 animate-fade-up">
            {[
              { stat: "2024", label: "Grundat i Stockholm" },
              { stat: "50 000+", label: "Serverade måltider" },
              { stat: "100%", label: "Växtbaserat" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center rounded-2xl bg-secondary p-6">
                <p className="text-3xl font-bold text-primary">{stat}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
