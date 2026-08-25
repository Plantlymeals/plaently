import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import type { InternalLink } from "@/data/internalLinks";

interface Props {
  title: string;
  links: InternalLink[];
  className?: string;
  showHints?: boolean;
}

/**
 * Keyword-anchored internal link block. Anchor text is the target page's
 * focus keyword so crawlers get a clear relevance signal.
 */
const InternalLinks = ({ title, links, className = "", showHints = true }: Props) => {
  if (links.length === 0) return null;
  return (
    <nav aria-label={title} className={className}>
      <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">{title}</h2>
      <ul className="grid sm:grid-cols-3 gap-4">
        {links.map((l) => (
          <li key={l.path + l.label}>
            <Link
              to={l.path}
              className="h-full flex flex-col justify-between gap-2 rounded-2xl bg-card border border-border/50 p-5 shadow-card hover:shadow-elevated transition-all group"
            >
              <span className="font-heading font-semibold text-sm capitalize group-hover:text-primary transition-colors">
                {l.label}
              </span>
              {showHints && l.hint && (
                <span className="text-xs text-muted-foreground leading-relaxed">{l.hint}</span>
              )}
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default InternalLinks;
