export const WHATSAPP_NUMBER = "15485777916";
export const BRAND_NAME = "SCS3D";
export const BRAND_URL = "scs3d.com";
export const BRAND_TAGLINE =
  "Your Kitchener-Waterloo 3D design and printing service — trending prints, custom CAD, WhatsApp ordering.";

export const CATEGORIES = [
  "Desk & Office",
  "Home & Decor",
  "Automotive",
  "Phone & Tech",
  "Toys & Collectibles",
  "Tools & Organizers",
  "Outdoor & Camping",
  "Custom Gifts",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const TREND_BADGES = {
  rising: { label: "Rising", emoji: "📈", color: "emerald" },
  trending: { label: "Trending", emoji: "🔥", color: "orange" },
  hot: { label: "Hot Today", emoji: "⚡", color: "red" },
  stable: { label: "Popular", emoji: "⭐", color: "cyan" },
} as const;

export type TrendStatus = keyof typeof TREND_BADGES;
