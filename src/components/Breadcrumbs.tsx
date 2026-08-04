import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  /** Visible label */
  label: string;
  /** Absolute site path, e.g. "/products". Omit for the current page. */
  path?: string;
}

const BASE_URL = "https://plaently.com";

interface BreadcrumbsProps {
  items: Crumb[];
  /** Language for the "Home" root crumb. */
  lang?: "sv" | "en";
  /** Emit BreadcrumbList JSON-LD. Disable when the page already supplies it. */
  emitSchema?: boolean;
  className?: string;
}

/**
 * Visible breadcrumb trail + BreadcrumbList structured data.
 * The home crumb is added automatically — pass only the deeper levels.
 */
const Breadcrumbs = ({ items, lang = "sv", emitSchema = true, className }: BreadcrumbsProps) => {
  const trail: Crumb[] = [{ label: lang === "sv" ? "Hem" : "Home", path: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${BASE_URL}${c.path ?? ""}`,
    })),
  };

  return (
    <>
      {emitSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
      )}
      <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {trail.map((c, i) => {
            const isLast = i === trail.length - 1;
            return (
              <Fragment key={`${c.label}-${i}`}>
                <li className="inline-flex items-center gap-1.5">
                  {isLast || !c.path ? (
                    <span aria-current={isLast ? "page" : undefined} className="font-medium text-foreground">
                      {c.label}
                    </span>
                  ) : (
                    <Link to={c.path} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                      {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                      {c.label}
                    </Link>
                  )}
                </li>
                {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;