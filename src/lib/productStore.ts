import { readFile } from "fs/promises";
import path from "path";
import { getRedis, isKvConfigured } from "@/lib/kv";
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
    if (data?.length) return data;

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

export async function saveAllProducts(products: Product[]): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  try {
    await redis.set(PRODUCTS_KEY, products);
    return true;
  } catch {
    return false;
  }
}

export function getPublishedProducts(products: Product[]): Product[] {
  return products
    .filter((p) => p.published)
    .sort((a, b) => b.trendScore - a.trendScore);
}
