import type { Category } from "./config";
import { fetchCults3dTrending } from "./cults3dFetcher";
import {
  DAILY_REPORT_PER_SITE,
  isWithinScoutWindow,
  SCOUT_POOL_PER_SITE,
  SCOUT_WINDOW_DAYS,
} from "./scoutConfig";

export interface FetchedTrendItem {
  title: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  notes: string;
  trendScore: number;
  category: Category;
  downloadsCount: number;
  likesCount: number;
  publishedAt?: string;
}

function guessCategory(title: string): Category {
  const t = title.toLowerCase();
  if (t.includes("car") || t.includes("automotive")) return "Automotive";
  if (t.includes("phone") || t.includes("magsafe") || t.includes("tech")) return "Phone & Tech";
  if (t.includes("dragon") || t.includes("toy") || t.includes("figure")) return "Toys & Collectibles";
  if (t.includes("organizer") || t.includes("gridfinity") || t.includes("tool")) return "Tools & Organizers";
  if (t.includes("vase") || t.includes("decor") || t.includes("home")) return "Home & Decor";
  if (t.includes("desk") || t.includes("office")) return "Desk & Office";
  return "Custom Gifts";
}

interface PrintablesGraphQlItem {
  id: string;
  name: string;
  slug: string;
  likesCount: number;
  downloadCount: number;
  datePublished?: string;
  image?: { filePath?: string };
}

type PrintablesOrdering = "latest" | "popular" | "makes_count";

const PRINTABLES_SEARCH = `
  query SearchPrints($limit: Int!, $ordering: SearchChoicesEnum!) {
    result: searchPrints2(query: "", printType: print, limit: $limit, ordering: $ordering) {
      items {
        id
        name
        slug
        likesCount
        downloadCount
        datePublished
        image { filePath }
      }
    }
  }
`;

async function fetchPrintablesByOrdering(
  ordering: PrintablesOrdering,
  limit: number
): Promise<FetchedTrendItem[]> {
  const res = await fetch("https://api.printables.com/graphql/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; SCS3D-Scout/1.0; +https://scs3d.com)",
    },
    body: JSON.stringify({
      operationName: "SearchPrints",
      query: PRINTABLES_SEARCH,
      variables: { limit, ordering },
    }),
    cache: "no-store",
  });
  if (!res.ok) return [];

  const json = await res.json();
  const results: PrintablesGraphQlItem[] = json?.data?.result?.items ?? [];

  return results
    .map((m) => {
      const imagePath = m.image?.filePath ?? "";
      const imageUrl = imagePath.startsWith("http")
        ? imagePath
        : imagePath
          ? `https://media.printables.com/${imagePath}`
          : "";

      const title = String(m.name || "Printables Model").slice(0, 120);
      const downloadsCount = m.downloadCount ?? 0;
      const likesCount = m.likesCount ?? 0;

      return {
        title,
        sourceUrl: `https://www.printables.com/model/${m.id}-${m.slug}`,
        sourceName: "Printables",
        imageUrl,
        notes: `Printables · ${ordering}, last ${SCOUT_WINDOW_DAYS}d window. Downloads: ${downloadsCount}`,
        trendScore: Math.min(95, 65 + Math.log10(Math.max(downloadsCount, 1)) * 8),
        category: guessCategory(title),
        downloadsCount,
        likesCount,
        publishedAt: m.datePublished,
      };
    })
    .filter((i) => i.imageUrl.startsWith("http"));
}

function dedupeByUrl(items: FetchedTrendItem[]): FetchedTrendItem[] {
  const seen = new Set<string>();
  const out: FetchedTrendItem[] = [];
  for (const item of items) {
    if (seen.has(item.sourceUrl)) continue;
    seen.add(item.sourceUrl);
    out.push(item);
  }
  return out;
}

/**
 * Printables UI proxy: Trending · Past 30 days
 * API has no direct "trending+30d" — merge latest + popular, keep last 30 days, sort by downloads.
 */
export async function fetchPrintablesTrending(
  poolSize = SCOUT_POOL_PER_SITE
): Promise<FetchedTrendItem[]> {
  try {
    const fetchSize = Math.max(poolSize, 30);
    const [latest, popular] = await Promise.all([
      fetchPrintablesByOrdering("latest", fetchSize),
      fetchPrintablesByOrdering("popular", fetchSize),
    ]);

    const inWindow = dedupeByUrl([...latest, ...popular]).filter((item) =>
      isWithinScoutWindow(item.publishedAt)
    );

    if (inWindow.length >= DAILY_REPORT_PER_SITE) {
      return inWindow
        .sort((a, b) => b.downloadsCount - a.downloadsCount)
        .slice(0, poolSize);
    }

    // Fallback: recent uploads only (still avoids all-time Benchy list)
    return latest.slice(0, poolSize);
  } catch {
    return [];
  }
}

/** Discovery pool: ~25 per site, last 30 days, for velocity ranking */
export async function fetchScoutPool(): Promise<FetchedTrendItem[]> {
  const [cults, printables] = await Promise.all([
    fetchCults3dTrending(SCOUT_POOL_PER_SITE).catch(() => [] as FetchedTrendItem[]),
    fetchPrintablesTrending(SCOUT_POOL_PER_SITE),
  ]);

  return [...cults, ...printables];
}

/** @deprecated use fetchScoutPool + velocity ranking */
export async function fetchBalancedTrending(
  perSite = DAILY_REPORT_PER_SITE
): Promise<FetchedTrendItem[]> {
  const pool = await fetchScoutPool();
  const cults = pool.filter((i) => i.sourceName === "Cults3D").slice(0, perSite);
  const printables = pool.filter((i) => i.sourceName === "Printables").slice(0, perSite);
  return [...cults, ...printables];
}

export async function fetchAllTrending(limit = 10): Promise<FetchedTrendItem[]> {
  const pool = await fetchScoutPool();
  return pool.sort((a, b) => b.trendScore - a.trendScore).slice(0, limit);
}
