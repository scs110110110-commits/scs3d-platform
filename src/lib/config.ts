export const WHATSAPP_NUMBER = "15485777916";
export const CONTACT_EMAIL = "ssuadiye@gmail.com";
export const BRAND_NAME = "SCS3D";
export const BRAND_URL = "scs3d.com";
export const BRAND_TAGLINE =
  "Professional 3D printing and custom CAD design — browse trending prints or bring your own idea.";

export const SOLUTIONS_TAGLINE =
  "Real customer designs and prints we've brought to life — custom CAD, personalized gifts, and one-off builds.";

export const CATALOG_SECTIONS = ["trending", "solutions"] as const;
export type CatalogSection = (typeof CATALOG_SECTIONS)[number];

export const SECTION_LABELS: Record<CatalogSection, string> = {
  trending: "Trending",
  solutions: "Custom Solutions",
};

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
