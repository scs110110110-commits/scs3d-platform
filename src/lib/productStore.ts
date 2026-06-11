import { readFile } from "fs/promises";
import path from "path";
import { getRedis, isKvConfigured } from "@/lib/kv";
import {
  persistAllProductImages,
  productHasEmbeddedImages,
  repairProductsFromImageStore,
} from "@/lib/productImageStore";
import type { CatalogSection } from "@/lib/config";
import { getProductSection } from "@/lib/productSection";
import type { Product } from "@/lib/types";

export { getProductSection };

const PRODUCTS_KEY = "scs3d:catalog:products";

export { isKvConfigured as isProductStoreConfigured };

async function readSeedProducts(): Promise<Product[]> {
  try {
    const seedPath = path.join(process.cwd(), "public", "data", "products.json");
    const raw = await readFile(seedPath, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export async function loadAllProducts(): Promise<Product[]> {
  const redis = getRedis();
  if (!redis) return [];

  try {
    const data = await redis.get<Product[]>(PRODUCTS_KEY);
    if (data?.length) {
      let updated = data;

      if (data.some(productHasEmbeddedImages)) {
        updated = await persistAllProductImages(data);
      }

      const repaired = await repairProductsFromImageStore(updated);
      if (repaired.changed) {
        updated = repaired.products;
      }

      if (updated !== data) {
        await redis.set(PRODUCTS_KEY, updated);
      }

      return updated;
    }

    const seed = await readSeedProducts();
    if (seed.length) {
      await redis.set(PRODUCTS_KEY, seed);
      return seed;
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveAllProducts(products: Product[]): Promise<{
  ok: boolean;
  error?: string;
}> {
  const redis = getRedis();
  if (!redis) {
    return { ok: false, error: "Redis not configured" };
  }

  try {
    const repaired = await repairProductsFromImageStore(products);
    let stored = repaired.products;

    if (stored.some(productHasEmbeddedImages)) {
      stored = await persistAllProductImages(stored);
    }

    await redis.set(PRODUCTS_KEY, stored);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Redis save failed";
    return { ok: false, error: message };
  }
}

export function getPublishedProducts(
  products: Product[],
  section?: CatalogSection
): Product[] {
  return products
    .filter((p) => p.published && (section ? getProductSection(p) === section : true))
    .sort((a, b) => b.trendScore - a.trendScore);
}
