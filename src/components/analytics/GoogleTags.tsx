"use client";

import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "";

/** Primary Google tag ID — prefer Ads if only Ads is set, else GA4 */
export function getGoogleTagId(): string {
  return GA_ID || ADS_ID;
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function trackConversion(sendTo: string, value?: number) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!sendTo) return;
  window.gtag("event", "conversion", {
    send_to: sendTo,
    value: value ?? 1,
    currency: "CAD",
  });
}

export function trackLead(method: "whatsapp" | "email", source?: string) {
  trackEvent("generate_lead", {
    method,
    source: source || "site",
  });

  const conversionLabel =
    method === "whatsapp"
      ? process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL?.trim()
      : process.env.NEXT_PUBLIC_GOOGLE_ADS_EMAIL_LABEL?.trim();

  if (ADS_ID && conversionLabel) {
    trackConversion(`${ADS_ID}/${conversionLabel}`);
  }
}

export default function GoogleTags() {
  const tagId = getGoogleTagId();
  if (!tagId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tags-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GA_ID ? `gtag('config', '${GA_ID}', { anonymize_ip: true });` : ""}
          ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
