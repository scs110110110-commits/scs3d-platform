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
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: BRAND_NAME,
    alternateName: "SCS 3D Printing",
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    telephone: `+${WHATSAPP_NUMBER}`,
    email: "ssuadiye@gmail.com",
    image: `${SITE_URL}/brand/scs3d-logo.png`,
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
      { "@type": "AdministrativeArea", name: "Ontario" },
      { "@type": "Country", name: "Canada" },
    ],
    priceRange: "$$",
    currenciesAccepted: "CAD",
    paymentAccepted: "Cash, E-Transfer, Credit Card",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "3D printing & custom CAD",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom 3D printing",
            description: "Made-to-order PLA/PETG prints from your idea or file",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom CAD design",
            description: "Personalized products with name, logo, or photo lithophane",
          },
        },
      ],
    },
    sameAs: [`https://${BRAND_URL}`, `https://www.${BRAND_URL}`],
  };
}
