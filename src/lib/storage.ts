import { parseApiJson } from "@/lib/apiClient";
import { prepareProductsForSave } from "@/lib/productImport";
import { shrinkProductImages } from "@/lib/productImages";
import type { Product, ScoutItem } from "./types";

const SCOUT_KEY = "scs3d_scout_queue";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Public catalog — all devices see the same products */
export async function fetchCatalogProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", { cache: "no-store" });
  const data = await parseApiJson<{ products?: Product[]; error?: string }>(res);
  if (!res.ok) throw new Error(data.error || "Failed to load catalog");
  return data.products ?? [];
}

/** Admin — full product list from server */
export async function fetchAdminProducts(): Promise<{
  products: Product[];
  warning?: string;
}> {
  const res = await fetch("/api/admin/products", {
    credentials: "include",
    cache: "no-store",
  });
  const data = await parseApiJson<{
    products?: Product[];
    error?: string;
    warning?: string;
  }>(res);
  if (!res.ok) throw new Error(data.error || "Failed to load products");
  return { products: data.products ?? [], warning: data.warning };
}

export async function saveProducts(
  products: Product[]
): Promise<{ warning?: string }> {
  const shrunk = await shrinkProductImages(products);
  const prepared = prepareProductsForSave(shrunk);

  const res = await fetch("/api/admin/products", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products: prepared.products }),
  });

  const data = await parseApiJson<{ error?: string; warning?: string }>(res);
  if (!res.ok) throw new Error(data.error || "Failed to save products");

  return { warning: data.warning || prepared.warning };
}

export function getPublishedProducts(products: Product[]): Product[] {
  return products
    .filter((p) => p.published)
    .sort((a, b) => b.trendScore - a.trendScore);
}

/** @deprecated use fetchCatalogProducts or fetchAdminProducts */
export async function loadSeedProducts(): Promise<Product[]> {
  const { products } = await fetchAdminProducts();
  return products;
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

export async function importProductsJson(
  file: File
): Promise<{ products: Product[]; warning?: string }> {
  const raw = await new Promise<unknown>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch {
        reject(new Error("Invalid JSON file — check format"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });

  const res = await fetch("/api/admin/products", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ import: true, data: raw }),
  });

  const data = await parseApiJson<{ error?: string; warning?: string }>(res);
  if (!res.ok) throw new Error(data.error || "Import failed");

  const { products } = await fetchAdminProducts();
  return { products, warning: data.warning };
}

export async function resetToSeed(): Promise<Product[]> {
  const res = await fetch("/data/products.json");
  const seed = (await res.json()) as Product[];
  await saveProducts(seed);
  return seed;
}
