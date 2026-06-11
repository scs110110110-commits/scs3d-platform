"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { normalizePagePath } from "@/lib/analyticsStore";

const TRACKED_PATHS = new Set(["/", "/custom"]);
const DEDUPE_MS = 30_000;

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef("");

  useEffect(() => {
    const path = normalizePagePath(pathname || "/");
    if (!TRACKED_PATHS.has(path)) return;

    const storageKey = `scs3d_pv_${path}`;
    const now = Date.now();
    const previous = Number(sessionStorage.getItem(storageKey) || "0");
    if (previous && now - previous < DEDUPE_MS) return;

    sessionStorage.setItem(storageKey, String(now));
    if (lastSent.current === `${path}:${previous}`) return;
    lastSent.current = `${path}:${now}`;

    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
      keepalive: true,
    }).catch(() => {
      // Non-blocking analytics
    });
  }, [pathname]);

  return null;
}
