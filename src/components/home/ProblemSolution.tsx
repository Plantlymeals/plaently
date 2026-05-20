import { useTranslation } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

const ProblemSolution = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container max-w-5xl">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-6 animate-fade-up">
          {t("ps.eyebrow")}
        </p>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-center">
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-10 text-center animate-fade-up py-[54px]">
            <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-3 text-foreground/90">
              {t("ps.problemTitle")}
            </h3>
            <p className="text-muted-foreground text-base md:text-lg">{t("ps.problemDesc")}</p>
          </div>
          <div className="flex justify-center text-primary animate-fade-up-delay-1">
            <ArrowRight className="h-8 w-8 md:h-10 md:w-10 hidden md:block" />
            <ArrowRight className="h-7 w-7 rotate-90 md:hidden" />
          </div>
          <div className="rounded-3xl gradient-primary p-8 md:p-10 text-center md:text-left text-primary-foreground shadow-elevated animate-fade-up-delay-2">
            <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-3">
              {t("ps.solutionTitle")}
            </h3>
            <p className="text-base md:text-lg opacity-95">{t("ps.solutionDesc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;