import { Briefcase, Dumbbell, Lightbulb, GraduationCap, Users, Star } from "lucide-react";

const icons = [
  { icon: Briefcase, label: "Offices" },
  { icon: Dumbbell, label: "Athletes" },
  { icon: Lightbulb, label: "Entrepreneurs" },
  { icon: GraduationCap, label: "Students" },
  { icon: Users, label: "Professionals" },
];

const TrustSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container text-center space-y-8">
        <div className="flex items-center justify-center gap-1 animate-fade-up">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-primary text-primary" />
          ))}
          <span className="ml-2 text-sm font-medium text-muted-foreground">4.8/5 from 2,000+ reviews</span>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground font-medium animate-fade-up-delay-1">
          Trusted by busy professionals, athletes and modern workplaces.
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 animate-fade-up-delay-2">
          {icons.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
