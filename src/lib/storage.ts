import type { Product, ScoutItem } from "./types";

const PRODUCTS_KEY = "scs3d_products";
const SCOUT_KEY = "scs3d_scout_queue";
const SEED_LOADED_KEY = "scs3d_seed_loaded";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export async function loadSeedProducts(): Promise<Product[]> {
  if (typeof window === "undefined") return [];
  if (localStorage.getItem(SEED_LOADED_KEY)) return getProducts();

  try {
    const res = await fetch("/data/products.json");
    const seed = (await res.json()) as Product[];
    saveProducts(seed);
    localStorage.setItem(SEED_LOADED_KEY, "1");
    return seed;
  } catch {
    return [];
  }
}

export function getPublishedProducts(products: Product[]): Product[] {
  return products
    .filter((p) => p.published)
    .sort((a, b) => b.trendScore - a.trendScore);
}

export function getScoutQueue(): ScoutItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SCOUT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ScoutItem[];
  } catch {
    return [];
  }
}

export function saveScoutQueue(items: ScoutItem[]): void {
  localStorage.setItem(SCOUT_KEY, JSON.stringify(items));
}

export function exportProductsJson(products: Product[]): void {
  const blob = new Blob([JSON.stringify(products, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importProductsJson(file: File): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Product[];
        saveProducts(data);
        resolve(data);
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });
}

export function resetToSeed(): void {
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(SEED_LOADED_KEY);
}
