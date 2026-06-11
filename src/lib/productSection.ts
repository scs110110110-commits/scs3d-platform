import type { CatalogSection } from "@/lib/config";
import type { Product } from "@/lib/types";

export function getProductSection(product: Pick<Product, "section">): CatalogSection {
  return product.section === "solutions" ? "solutions" : "trending";
}
