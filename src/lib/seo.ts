import { BRAND_NAME, BRAND_URL, WHATSAPP_NUMBER } from "./config";

export const SITE_URL = `https://${BRAND_URL}`;

export const SEO_TITLE =
  "SCS3D | Kitchener-Waterloo 3D Design & Printing Service";

export const SEO_DESCRIPTION =
  "SCS3D is a Kitchener-Waterloo 3D design and printing service. Browse trending 3D prints, get custom CAD design, and order fast via WhatsApp. Local pickup & Canada shipping.";

export const SEO_KEYWORDS = [
  "Kitchener-Waterloo 3D printing",
  "3D design and printing service",
  "3D printing Kitchener",
  "3D printing Waterloo",
  "custom 3D printing Ontario",
  "CAD design Kitchener",
  "local 3D print shop",
  "3D printed products Canada",
  "SCS3D",
  "trending 3D prints",
  "WhatsApp 3D print order",
];

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND_NAME,
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kitchener",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.4516,
      longitude: -80.4925,
    },
    areaServed: [
      { "@type": "City", name: "Kitchener" },
      { "@type": "City", name: "Waterloo" },
      { "@type": "City", name: "Cambridge" },
      { "@type": "Country", name: "Canada" },
    ],
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [`https://${BRAND_URL}`],
  };
}
