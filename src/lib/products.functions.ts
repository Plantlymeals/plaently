import { createServerFn } from "@tanstack/react-start";
import { fetchProductListForSsr } from "./products.server";

export const getProductList = createServerFn({ method: "GET" }).handler(async () => {
  return fetchProductListForSsr();
});
