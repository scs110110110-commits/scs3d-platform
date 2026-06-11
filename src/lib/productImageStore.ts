import { getRedis } from "@/lib/kv";
import { galleryToProductFields, getProductImages } from "@/lib/productImages";
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
  return value.startsWith("/api/catalog-image/");
}

export function productsForClientResponse(products: Product[]): Product[] {
  return products.map((product) => {
    const gallery = getProductImages(product);
    const urls = gallery.map((img, index) => {
      if (isDataUrl(img)) return catalogImageUrl(product.id, index);
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

  return img;
}

export async function persistProductImages(product: Product): Promise<Product> {
  const gallery = getProductImages(product);
  const urls: string[] = [];

  for (let index = 0; index < gallery.length; index++) {
    const img = gallery[index];
    if (isDataUrl(img)) {
      await saveProductImage(product.id, index, img);
      urls.push(catalogImageUrl(product.id, index));
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
