import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitSitemapToGoogle } from "@/lib/searchConsole";

const BASE_URL = "https://plaently.com";
const LIVE_SITEMAP_URL = `${import.meta.env['VITE_SUPABASE_URL']}/functions/v1/sitemap`;

type Kind = "product" | "blog";

interface Row {
  kind: Kind;
  slug: string;
  title: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
  language?: string;
  url: string;
  canonical: string;
  noindex: boolean; // derived: unpublished pages are effectively noindex (not in sitemap, 404 in app)
}

const StatusPill = ({ ok, warn, label }: { ok?: boolean; warn?: boolean; label: string }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
      ok && "bg-primary/10 text-primary",
      warn && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
      !ok && !warn && "bg-destructive/10 text-destructive"
    )}
  >
    {ok ? <CheckCircle2 className="h-3 w-3" /> : warn ? <AlertTriangle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
    {label}
  </span>
);

const AdminSEO = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "product" | "blog" | "issues">("all");
  const [q, setQ] = useState("");
  const [sitemapCount, setSitemapCount] = useState<number | null>(null);
  const [sitemapChecking, setSitemapChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitToGoogle = async () => {
    setSubmitting(true);
    await submitSitemapToGoogle();
    setSubmitting(false);
  };

  const checkSitemap = async () => {
    setSitemapChecking(true);
    try {
      const res = await fetch(`${LIVE_SITEMAP_URL}?t=${Date.now()}`);
      const xml = await res.text();
      setSitemapCount((xml.match(/<url>/g) || []).length);
    } catch {
      setSitemapCount(null);
    }
    setSitemapChecking(false);
  };

  const fetchAll = async () => {
    setLoading(true);
    const [prod, blog] = await Promise.all([
      supabase
        .from("products")
        .select("slug, name, is_published, updated_at, created_at")
        .order("updated_at", { ascending: false }),
      supabase
        .from("blog_posts")
        .select("slug, title, is_published, published_at, updated_at, language")
        .order("updated_at", { ascending: false }),
    ]);
    setLoading(false);

    const productRows: Row[] = (prod.data || []).map((p: any) => ({
      kind: "product",
      slug: p.slug,
      title: p.name,
      published: !!p.is_published,
      publishedAt: null,
      updatedAt: p.updated_at,
      url: `${BASE_URL}/product/${p.slug}`,
      canonical: `${BASE_URL}/product/${p.slug}`,
      noindex: !p.is_published,
    }));
    const blogRows: Row[] = (blog.data || []).map((b: any) => ({
      kind: "blog",
      slug: b.slug,
      title: b.title,
      published: !!b.is_published,
      publishedAt: b.published_at,
      updatedAt: b.updated_at,
      language: b.language,
      url: `${BASE_URL}/blog/${b.slug}`,
      canonical: `${BASE_URL}/blog/${b.slug}`,
      noindex: !b.is_published,
    }));
    setRows([...productRows, ...blogRows]);
  };

  useEffect(() => { fetchAll(); }, []);

  const hasIssue = (r: Row) =>
    r.noindex ||
    (r.kind === "blog" && r.published && !r.publishedAt) ||
    !r.slug;

  const filtered = rows.filter((r) => {
    if (filter === "product" && r.kind !== "product") return false;
    if (filter === "blog" && r.kind !== "blog") return false;
    if (filter === "issues" && !hasIssue(r)) return false;
    if (q && !`${r.title} ${r.slug}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: rows.length,
    indexable: rows.filter((r) => !r.noindex).length,
    noindex: rows.filter((r) => r.noindex).length,
    issues: rows.filter(hasIssue).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold">SEO &amp; indexering</h1>
          <p className="text-sm text-muted-foreground">Indexeringsstatus, canonical och senast publicerad för produkter och bloggsidor.</p>
        </div>
        <Button variant="outline" onClick={fetchAll} disabled={loading} className="rounded-full gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Uppdatera
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Totalt", value: stats.total },
          { label: "Indexerbara", value: stats.indexable, accent: "text-primary" },
          { label: "Noindex / opublicerade", value: stats.noindex, accent: "text-amber-600" },
          { label: "Att åtgärda", value: stats.issues, accent: stats.issues > 0 ? "text-destructive" : "text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-4 shadow-card">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn("font-heading text-2xl font-bold mt-1", s.accent)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Dynamisk sitemap */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-card space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-heading text-lg font-semibold">Dynamisk sitemap</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Sitemapen genereras live vid varje anrop från publicerade bloggposter och Shopify-produkter.
              Nytt innehåll du publicerar här syns direkt – ingen ny publicering av sajten behövs.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={checkSitemap} disabled={sitemapChecking}>
              <RefreshCw className={cn("h-4 w-4", sitemapChecking && "animate-spin")} /> Kontrollera
            </Button>
            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={submitToGoogle} disabled={submitting}>
              <RefreshCw className={cn("h-4 w-4", submitting && "animate-spin")} /> Skicka till Google
            </Button>
            <Button asChild size="sm" className="rounded-full gap-2">
              <a href={LIVE_SITEMAP_URL} target="_blank" rel="noopener noreferrer">
                Öppna sitemap <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <code className="block text-[11px] text-muted-foreground break-all">{LIVE_SITEMAP_URL}</code>
        {sitemapCount !== null && (
          <StatusPill ok label={`${sitemapCount} URL:er i live-sitemapen`} />
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        {([
          ["all", "Alla"],
          ["product", "Produkter"],
          ["blog", "Bloggsidor"],
          ["issues", "Bara problem"],
        ] as const).map(([k, label]) => (
          <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)} className="rounded-full">
            {label}
          </Button>
        ))}
        <div className="relative flex-1 min-w-[180px] max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sök titel eller slug…" className="pl-9 rounded-full" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Sida</th>
                <th className="text-left px-4 py-3 font-semibold">Typ</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Canonical</th>
                <th className="text-left px-4 py-3 font-semibold">Senast publicerad / uppdaterad</th>
                <th className="text-right px-4 py-3 font-semibold">Live</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">{loading ? "Hämtar…" : "Inga rader matchar."}</td></tr>
              )}
              {filtered.map((r) => {
                const lastDate = r.publishedAt || r.updatedAt;
                return (
                  <tr key={`${r.kind}-${r.slug}`} className="border-t border-border/40">
                    <td className="px-4 py-3 min-w-0">
                      <p className="font-medium truncate max-w-xs" title={r.title}>{r.title}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">/{r.kind === "product" ? "product" : "blog"}/{r.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
                      {r.kind}{r.language ? ` · ${r.language}` : ""}
                    </td>
                    <td className="px-4 py-3 space-x-1 whitespace-nowrap">
                      {r.noindex ? (
                        <StatusPill warn label="noindex" />
                      ) : (
                        <StatusPill ok label="indexerbar" />
                      )}
                      {r.kind === "blog" && r.published && !r.publishedAt && (
                        <StatusPill warn label="saknar published_at" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[11px] text-muted-foreground break-all">{r.canonical}</code>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {lastDate ? new Date(lastDate).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Öppna <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Canonical härleds från slug enligt det mönster som <code>SEOHead</code> sätter på varje route. Opublicerade rader ingår varken i sitemap eller i applikationens routes och behandlas därför som noindex.
      </p>
    </div>
  );
};

export default AdminSEO;