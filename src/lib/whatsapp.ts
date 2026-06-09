import { BRAND_NAME, BRAND_URL, WHATSAPP_NUMBER } from "./config";
import type { Product } from "./types";

export function buildOrderMessage(product: Product): string {
  return [
    `🛒 *${BRAND_NAME} SİPARİŞ TALEBİ*`,
    `🌐 ${BRAND_URL}`,
    "",
    `📦 *Ürün:* ${product.title}`,
    `💰 *Fiyat:* $${product.price} CAD`,
    `🧱 *Malzeme:* ${product.material}`,
    `📂 *Kategori:* ${product.category}`,
    "",
    `📝 ${product.shortDescription}`,
    "",
    "Merhaba! Bu ürünü sipariş etmek istiyorum.",
    "Renk ve miktar tercihlerimi paylaşacağım.",
    "",
    "📍 Kitchener-Waterloo — Local pickup available",
  ].join("\n");
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppOrder(product: Product): void {
  const message = buildOrderMessage(product);
  window.open(getWhatsAppUrl(message), "_blank");
}
