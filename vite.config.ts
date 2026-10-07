// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

// Workers have no import.meta.url. Nitro's own guard only matches the literal
// `createRequire(import.meta.url)`, so minified aliases (`e(import.meta.url)`)
// slip through and crash every request. Patch any aliased call too.
function patchCode(code: string): string {
  if (!code.includes("import.meta.url")) return code;
  const aliases = new Set<string>(["createRequire"]);
  for (const m of code.matchAll(/createRequire\s+as\s+([\w$]+)/g)) aliases.add(m[1]!);
  let out = code;
  for (const a of aliases) {
    const re = new RegExp(`(^|[^\\w$.])${a.replace(/\$/g, "\\$")}\\(import\\.meta\\.url\\)`, "g");
    out = out.replace(re, `$1${a}(import.meta.url || "file:///")`);
  }
  return out;
}

const guardCreateRequire = {
  name: "plaently:guard-create-require",
  enforce: "post" as const,
  generateBundle(_o: unknown, bundle: Record<string, { type: string; code?: string }>) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === "chunk" && chunk.code) chunk.code = patchCode(chunk.code);
    }
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [mcpPlugin(), guardCreateRequire],
  },
});
