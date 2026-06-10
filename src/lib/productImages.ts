import type { Product } from "./types";

export const MAX_PRODUCT_IMAGES = 8;
export const MAX_PRODUCT_IMAGE_BYTES = 2 * 1024 * 1024;

export function getProductImages(product: Pick<Product, "imageUrl" | "images">): string[] {
  const list = [product.imageUrl, ...(product.images ?? [])].filter(Boolean);
  return [...new Set(list)];
}

export function galleryToProductFields(gallery: string[]): Pick<Product, "imageUrl" | "images"> {
  const unique = [...new Set(gallery.filter(Boolean))];
  return {
    imageUrl: unique[0] ?? "",
    images: unique.slice(1),
  };
}
