import { createServerFn } from "@tanstack/react-start";
import { fetchProductListForSsr } from "./products.server";

export const getProductList = createServerFn({ method: "GET" }).handler(async () => {
  // Preview Workers do not consistently expose encrypted bindings through
  // process.env. The storefront token is publishable and already shipped to
  // the browser, so use the build-injected value as the Worker-safe fallback.
  const token =
    process.env["SHOPIFY_STOREFRONT_TOKEN"] ??
    process.env["SHOPIFY_STOREFRONT_ACCESS_TOKEN"] ??
    import.meta.env["VITE_SHOPIFY_STOREFRONT_TOKEN"];
  return fetchProductListForSsr(token);
});
