import { CATALOG_SECTIONS, CATEGORIES, type CatalogSection, type Category } from "@/lib/config";
import type { Product } from "@/lib/types";

const MAX_SAVE_BYTES = 3_200_000;

function isDataUrl(value: string): boolean {
  return value.startsWith("data:image/");
}

export function estimateProductsBytes(products: Product[]): number {
  return new TextEncoder().encode(JSON.stringify(products)).length;
}

export function stripBase64Images(products: Product[]): {
  products: Product[];
  strippedImages: number;
} {
  let strippedImages = 0;

  const cleaned = products.map((product) => {
    let imageUrl = product.imageUrl;
    const images: string[] = [];

    if (isDataUrl(imageUrl)) {
      imageUrl = "";
      strippedImages += 1;
    }

    for (const img of product.images ?? []) {
      if (isDataUrl(img)) {
        strippedImages += 1;
      } else if (img) {
        images.push(img);
      }
    }

    return { ...product, imageUrl, images };
  });

  return { products: cleaned, strippedImages };
}

function asSection(value: unknown): CatalogSection {
  if (typeof value === "string" && CATALOG_SECTIONS.includes(value as CatalogSection)) {
    return value as CatalogSection;
  }
  return "trending";
}

function asCategory(value: unknown): Category {
  if (typeof value === "string" && CATEGORIES.includes(value as Category)) {
    return value as Category;
  }
  return "Custom Gifts";
}

export function normalizeProduct(raw: Partial<Product>, index: number): Product {
  const now = new Date().toISOString();
  return {
    id: String(raw.id || `import-${Date.now()}-${index}`),
    title: String(raw.title || "Untitled Product").slice(0, 200),
    shortDescription: String(raw.shortDescription || raw.title || "").slice(0, 200),
    description: String(raw.description || raw.shortDescription || raw.title || ""),
    price: Number(raw.price) || 20,
    imageUrl: String(raw.imageUrl || ""),
    images: Array.isArray(raw.images) ? raw.images.map(String) : [],
    category: asCategory(raw.category),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    trendScore: Math.min(100, Math.max(1, Number(raw.trendScore) || 70)),
    status:
      raw.status === "hot" ||
      raw.status === "trending" ||
      raw.status === "rising" ||
      raw.status === "stable"
        ? raw.status
        : "rising",
    sourceUrl: raw.sourceUrl ? String(raw.sourceUrl) : undefined,
    sourceName: raw.sourceName ? String(raw.sourceName) : undefined,
    material: String(raw.material || "PLA"),
    published: raw.published !== false,
    featured: Boolean(raw.featured),
    socialProof: Number(raw.socialProof) || 100,
    createdAt: String(raw.createdAt || now),
    section: asSection(raw.section),
  };
}

export function parseProductsJson(raw: unknown): Product[] {
  let list: unknown[] = [];

  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.products)) {
      list = obj.products;
    } else if (obj.title || obj.id) {
      list = [obj];
    }
  }

  if (!list.length) {
    throw new Error(
      "JSON must be a product array, { products: [...] }, or a single product object."
    );
  }

  return list.map((item, index) =>
    normalizeProduct((item ?? {}) as Partial<Product>, index)
  );
}

const MAX_RESPONSE_BYTES = 3_000_000;

export function capProductsForResponse(products: Product[]): {
  products: Product[];
  warning?: string;
} {
  if (estimateProductsBytes(products) <= MAX_RESPONSE_BYTES) {
    return { products };
  }

  const { products: stripped, strippedImages } = stripBase64Images(products);
  return {
    products: stripped,
    warning:
      strippedImages > 0
        ? "Photos were not loaded (catalog too large). Re-upload images before saving — saving now would remove photos."
        : "Catalog response was trimmed due to size.",
  };
}

export function prepareProductsForSave(products: Product[]): {
  products: Product[];
  warning?: string;
} {
  const bytes = estimateProductsBytes(products);

  if (bytes <= MAX_SAVE_BYTES) {
    return { products };
  }

  throw new Error(
    `Catalog data too large (${Math.round(bytes / 1024)} KB). Save fewer products at once or shorten descriptions. Photos are stored separately and should not be removed.`
  );
}
