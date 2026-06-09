import { BRAND_NAME, BRAND_URL, WHATSAPP_NUMBER } from "./config";
import type { Product } from "./types";

export const ORDER_BUTTON_LABEL = "Order on WhatsApp";

export function buildOrderMessage(product: Product): string {
  return [
    `Hi ${BRAND_NAME}! I'd like to place an order from ${BRAND_URL}:`,
    "",
    `Order: ${product.title}`,
    `Material: ${product.material}`,
    `Category: ${product.category}`,
    "",
    product.shortDescription,
    "",
    "Please send me a quote for this item.",
    "I'll share my color and quantity preferences in this chat.",
    "",
    "Local pickup available in Kitchener-Waterloo.",
  ].join("\n");
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppOrder(product: Product): void {
  const message = buildOrderMessage(product);
  window.open(getWhatsAppUrl(message), "_blank");
}
