import { readFile } from "fs/promises";
import path from "path";
import { getRedis, isKvConfigured } from "@/lib/kv";
import {
  persistAllProductImages,
  productHasEmbeddedImages,
} from "@/lib/productImageStore";
import type { Product } from "@/lib/types";

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
      if (data.some(productHasEmbeddedImages)) {
        const migrated = await persistAllProductImages(data);
        await redis.set(PRODUCTS_KEY, migrated);
        return migrated;
      }
      return data;
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
    const stored = products.some(productHasEmbeddedImages)
      ? await persistAllProductImages(products)
      : products;
    await redis.set(PRODUCTS_KEY, stored);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Redis save failed";
    return { ok: false, error: message };
  }
}

export function getPublishedProducts(products: Product[]): Product[] {
  return products
    .filter((p) => p.published)
    .sort((a, b) => b.trendScore - a.trendScore);
}
