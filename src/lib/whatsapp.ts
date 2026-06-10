import { BRAND_NAME, BRAND_URL, CONTACT_EMAIL, WHATSAPP_NUMBER } from "./config";

export const ORDER_BUTTON_LABEL = "Order on WhatsApp";

export function buildOrderMessage(product: {
  title: string;
  material: string;
  category: string;
  shortDescription: string;
}): string {
  return [
    `Hi ${BRAND_NAME}! I'd like to place an order from ${BRAND_URL}:`,
    "",
    `Order: ${product.title}`,
    `Material: ${product.material}`,
    `Category: ${product.category}`,
    "",
    product.shortDescription,
    "",
    "I'll share my color and quantity preferences in this chat.",
    "",
    "Local pickup available in Kitchener-Waterloo.",
  ].join("\n");
}

export function buildCustomWhatsAppMessage(params: {
  name: string;
  phone: string;
  email: string;
  idea: string;
  dimensions: string;
}): string {
  return [
    `Hi ${BRAND_NAME}! I have a custom 3D print / CAD request from ${BRAND_URL}:`,
    "",
    params.name.trim() ? `Name: ${params.name.trim()}` : null,
    `Phone: ${params.phone.trim()}`,
    params.email.trim() ? `Email: ${params.email.trim()}` : null,
    "",
    `Idea: ${params.idea.trim()}`,
    params.dimensions.trim() ? `Dimensions: ${params.dimensions.trim()}` : null,
    "",
    "Please send me a quote for this custom project.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getOrderEmailHref(product: Parameters<typeof buildOrderMessage>[0]): string {
  const subject = `[${BRAND_NAME}] Order — ${product.title}`;
  const body = buildOrderMessage(product);
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Opens the user's default mail app addressed to CONTACT_EMAIL */
export function openOrderEmail(product: Parameters<typeof buildOrderMessage>[0]): void {
  const href = getOrderEmailHref(product);
  const link = document.createElement("a");
  link.href = href;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function openWhatsAppOrder(product: Parameters<typeof buildOrderMessage>[0]): void {
  window.open(getWhatsAppUrl(buildOrderMessage(product)), "_blank");
}

export function openCustomWhatsAppRequest(
  params: Parameters<typeof buildCustomWhatsAppMessage>[0]
): void {
  window.open(getWhatsAppUrl(buildCustomWhatsAppMessage(params)), "_blank");
}
