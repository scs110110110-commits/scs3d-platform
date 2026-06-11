import { getRuntimeEnv } from "@/lib/env";

export function getSiteOrigin(fallbackOrigin?: string): string {
  const explicit = getRuntimeEnv("NEXT_PUBLIC_SITE_URL", "SITE_URL");
  if (explicit) return explicit.replace(/\/$/, "");

  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "");

  const vercel = getRuntimeEnv("VERCEL_URL");
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "";
}

export function toAbsoluteUrl(path: string, origin?: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const base = getSiteOrigin(origin);
  if (!base) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
