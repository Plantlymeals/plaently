/**
 * Server-side stale-while-revalidate cache for visitor-independent reads.
 * Layer 1: per-isolate memory. Layer 2: Cloudflare Cache API (shared at the edge).
 * Safe to import in the browser, but only call it on the server (import.meta.env.SSR).
 */
type Entry = { value: unknown; storedAt: number };

const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();
const MAX_ENTRIES = 300;

function edgeCache(): Cache | null {
  try {
    const c = (globalThis as { caches?: { default?: Cache } }).caches;
    return c?.default ?? null;
  } catch {
    return null;
  }
}

const keyUrl = (key: string) => `https://cache.plaently.internal/${encodeURIComponent(key)}`;

async function readEdge(key: string): Promise<Entry | null> {
  const cache = edgeCache();
  if (!cache) return null;
  try {
    const res = await cache.match(keyUrl(key));
    if (!res) return null;
    return (await res.json()) as Entry;
  } catch {
    return null;
  }
}

async function writeEdge(key: string, entry: Entry, maxAgeSec: number) {
  const cache = edgeCache();
  if (!cache) return;
  try {
    await cache.put(
      keyUrl(key),
      new Response(JSON.stringify(entry), {
        headers: { "Content-Type": "application/json", "Cache-Control": `public, max-age=${maxAgeSec}` },
      }),
    );
  } catch {
    /* best effort */
  }
}

function remember(key: string, entry: Entry) {
  if (memory.size >= MAX_ENTRIES) {
    const oldest = memory.keys().next().value;
    if (oldest !== undefined) memory.delete(oldest);
  }
  memory.set(key, entry);
}

export interface CacheOptions<T> {
  ttlMs: number;
  staleMs: number;
  /** Return a TTL for this value, or null to not cache it (e.g. errors). */
  ttlFor?: (value: T) => number | null;
}

export async function cached<T>(key: string, opts: CacheOptions<T>, loader: () => Promise<T>): Promise<T> {
  const refresh = (): Promise<T> => {
    const existing = inflight.get(key);
    if (existing) return existing as Promise<T>;
    const p = (async () => {
      try {
        const value = await loader();
        const ttl = opts.ttlFor ? opts.ttlFor(value) : opts.ttlMs;
        if (ttl !== null && ttl > 0) {
          // Store with storedAt shifted so a shorter TTL expires sooner.
          const entry = { value, storedAt: Date.now() - (opts.ttlMs - ttl) };
          remember(key, entry);
          await writeEdge(key, entry, Math.ceil((ttl + opts.staleMs) / 1000));
        }
        return value;
      } finally {
        inflight.delete(key);
      }
    })();
    inflight.set(key, p);
    return p;
  };

  let entry = memory.get(key) ?? null;
  if (!entry) {
    entry = await readEdge(key);
    if (entry) remember(key, entry);
  }
  if (entry) {
    const age = Date.now() - entry.storedAt;
    if (age < opts.ttlMs) return entry.value as T;
    if (age < opts.ttlMs + opts.staleMs) {
      refresh().catch(() => {});
      return entry.value as T;
    }
  }
  return refresh();
}
