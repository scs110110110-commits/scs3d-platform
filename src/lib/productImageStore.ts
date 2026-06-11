import { getRedis } from "@/lib/kv";
import { galleryToProductFields, getProductImages } from "@/lib/productImages";
import { toAbsoluteUrl } from "@/lib/siteUrl";
import type { Product } from "@/lib/types";

const IMAGE_PREFIX = "scs3d:catalog:img";

function imageKey(productId: string, index: number): string {
  return `${IMAGE_PREFIX}:${productId}:${index}`;
}

export function catalogImageUrl(productId: string, index: number): string {
  return `/api/catalog-image/${productId}/${index}`;
}

export function isDataUrl(value: string): boolean {
  return value.startsWith("data:image/");
}

export function isCatalogImageUrl(value: string): boolean {
  return value.startsWith("/api/catalog-image/") || value.includes("/api/catalog-image/");
}

export function productsForClientResponse(products: Product[], origin?: string): Product[] {
  return products.map((product) => {
    const gallery = getProductImages(product);
    const urls = gallery.map((img, index) => {
      if (isDataUrl(img)) {
        return toAbsoluteUrl(catalogImageUrl(product.id, index), origin);
      }
      if (isCatalogImageUrl(img)) {
        const path = img.startsWith("http")
          ? new URL(img).pathname
          : img.startsWith("/")
            ? img
            : catalogImageUrl(product.id, index);
        return toAbsoluteUrl(path, origin);
      }
      return img;
    });
    return { ...product, ...galleryToProductFields(urls) };
  });
}

export async function saveProductImage(
  productId: string,
  index: number,
  dataUrl: string
): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  await redis.set(imageKey(productId, index), dataUrl);
}

export async function loadProductImageData(
  productId: string,
  index: number,
  products?: Product[]
): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;

  const stored = await redis.get<string>(imageKey(productId, index));
  if (typeof stored === "string" && stored.length > 0) {
    return stored;
  }

  const list = products;
  if (!list) return null;

  const product = list.find((item) => item.id === productId);
  if (!product) return null;

  const gallery = getProductImages(product);
  const img = gallery[index];
  if (!img) return null;

  if (isDataUrl(img)) {
    await redis.set(imageKey(productId, index), img);
    return img;
  }

  return null;
}

export async function persistProductImages(product: Product): Promise<Product> {
  const gallery = getProductImages(product);
  const urls: string[] = [];

  for (let index = 0; index < gallery.length; index++) {
    const img = gallery[index];
    if (isDataUrl(img)) {
      await saveProductImage(product.id, index, img);
      urls.push(catalogImageUrl(product.id, index));
    } else if (isCatalogImageUrl(img)) {
      const path = img.startsWith("http") ? new URL(img).pathname : img;
      urls.push(path);
    } else if (img) {
      urls.push(img);
    }
  }

  return { ...product, ...galleryToProductFields(urls) };
}

export async function persistAllProductImages(products: Product[]): Promise<Product[]> {
  return Promise.all(products.map((product) => persistProductImages(product)));
}

export function productHasEmbeddedImages(product: Product): boolean {
  if (isDataUrl(product.imageUrl)) return true;
  return (product.images ?? []).some(isDataUrl);
}

export async function repairProductsFromImageStore(
  products: Product[]
): Promise<{ products: Product[]; changed: boolean }> {
  const redis = getRedis();
  if (!redis) return { products, changed: false };

  let keys: string[] = [];
  try {
    keys = await redis.keys(`${IMAGE_PREFIX}:*`);
  } catch {
    return { products, changed: false };
  }

  const byProduct = new Map<string, number[]>();
  for (const key of keys) {
    const prefix = `${IMAGE_PREFIX}:`;
    if (!key.startsWith(prefix)) continue;
    const rest = key.slice(prefix.length);
    const colon = rest.lastIndexOf(":");
    if (colon < 0) continue;
    const productId = rest.slice(0, colon);
    const index = Number(rest.slice(colon + 1));
    if (!productId || !Number.isInteger(index) || index < 0) continue;
    const list = byProduct.get(productId) ?? [];
    list.push(index);
    byProduct.set(productId, list);
  }

  if (!byProduct.size) return { products, changed: false };

  let changed = false;
  const repaired = products.map((product) => {
    const indices = byProduct.get(product.id);
    if (!indices?.length) return product;

    const gallery = getProductImages(product);
    if (gallery.length > 0) return product;

    const urls = [...new Set(indices)].sort((a, b) => a - b).map((i) => catalogImageUrl(product.id, i));
    changed = true;
    return { ...product, ...galleryToProductFields(urls) };
  });

  return { products: repaired, changed };
}
