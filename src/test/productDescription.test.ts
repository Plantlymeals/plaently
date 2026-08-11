import { describe, it, expect } from "vitest";
import { translateProductHtml, translateProductText } from "@/lib/productDescription";

const yellowCurryMixed =
  "Creamy kokosmjölk with curry, koriander och lime — a trip to Southeast Asian street food. Protein-based rice with a creamy yellow curry sauce.";

const yellowCurryEn =
  "Creamy coconut milk with curry, coriander and lime — a trip to Southeast Asian street food. Protein-based rice with a creamy yellow curry sauce.";

const yellowCurrySv =
  "Krämig kokosmjölk med curry, koriander och lime — en resa till Sydostasiens gatukök. Proteinrikt ris med en krämig gul currysås.";

const carbonaraMixed =
  "Krämig, pepprig carbonara i klassisk italiensk stil — med en lekfull kontrast i konsistens. Protein-based fusilli with a creamy carbonara sauce.";

const carbonaraEn =
  "Creamy, peppery carbonara in classic Italian style — with a clever play of textures. Protein-based fusilli with a creamy carbonara sauce.";

const carbonaraSv =
  "Krämig, pepprig carbonara i klassisk italiensk stil — med en lekfull kontrast i konsistens. Proteinrik fusilli med en krämig carbonarasås.";

const smokyBbqEn =
  "Smoky BBQ with smoked paprika, caramelised onion and garlic — rich lentil texture, maximum satiety. Protein-based green lentils with vegan smoky BBQ sauce.";

const smokyBbqSv =
  "Rökig BBQ med sotad paprika, karamelliserad lök och vitlök. Proteinrika gröna linser med vegansk rökig BBQ sås.";

describe("product description translation", () => {
  it("fixes mixed Swedish words in Yellow Curry English copy", () => {
    const result = translateProductHtml(yellowCurryMixed, "en");
    expect(result).toBe(yellowCurryEn);
  });

  it("keeps correct Yellow Curry English copy unchanged", () => {
    const result = translateProductHtml(yellowCurryEn, "en");
    expect(result).toBe(yellowCurryEn);
  });

  it("translates Yellow Curry to fully Swedish", () => {
    const result = translateProductHtml(yellowCurryMixed, "sv");
    expect(result).toBe(yellowCurrySv);
  });

  it("translates correct Yellow Curry English to Swedish", () => {
    const result = translateProductHtml(yellowCurryEn, "sv");
    expect(result).toBe(yellowCurrySv);
  });

  it("fixes mixed Swedish words in Carbonara English copy", () => {
    const result = translateProductHtml(carbonaraMixed, "en");
    expect(result).toBe(carbonaraEn);
  });

  it("keeps correct Carbonara English copy unchanged", () => {
    const result = translateProductHtml(carbonaraEn, "en");
    expect(result).toBe(carbonaraEn);
  });

  it("translates Carbonara to fully Swedish", () => {
    const result = translateProductHtml(carbonaraMixed, "sv");
    expect(result).toBe(carbonaraSv);
  });

  it("translates correct Carbonara English to Swedish", () => {
    const result = translateProductHtml(carbonaraEn, "sv");
    expect(result).toBe(carbonaraSv);
  });

  it("does not describe Carbonara as vegan in English", () => {
    const result = translateProductHtml(
      "Protein-based fusilli with vegan carbonara sauce.",
      "en",
    );
    expect(result.toLowerCase()).not.toContain("vegan");
  });

  it("does not describe Yellow Curry as vegan in English", () => {
    const result = translateProductHtml(
      "Protein-based rice with vegan yellow curry sauce.",
      "en",
    );
    expect(result.toLowerCase()).not.toContain("vegan");
  });

  it("does not describe Carbonara as vegan in Swedish", () => {
    const result = translateProductText(
      "Protein-based fusilli with vegan carbonara sauce.",
      "sv",
    );
    expect(result.toLowerCase()).not.toContain("vegansk");
    expect(result.toLowerCase()).not.toContain("växtbaserad");
  });

  it("does not describe Yellow Curry as vegan in Swedish", () => {
    const result = translateProductText(
      "Protein-based rice with vegan yellow curry sauce.",
      "sv",
    );
    expect(result.toLowerCase()).not.toContain("vegansk");
    expect(result.toLowerCase()).not.toContain("växtbaserad");
  });
});
