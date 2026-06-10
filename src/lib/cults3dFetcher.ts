import type { Category } from "@/lib/config";
import { getRuntimeEnv } from "@/lib/env";
import {
  SCOUT_POOL_PER_SITE,
  SCOUT_WINDOW_DAYS,
  scoutWindowStartIso,
} from "@/lib/scoutConfig";
import type { FetchedTrendItem } from "@/lib/trendFetcher";

interface CultsCreation {
  name?: string;
  url?: string;
  shortUrl?: string;
  illustrationImageUrl?: string;
  likesCount?: number;
  downloadsCount?: number;
  viewsCount?: number;
  publishedAt?: string;
}

const CULTS_RECENT_DOWNLOADS = `
  query CultsRecentDownloads($limit: Int!, $after: String!) {
    creationsBatch(
      sort: BY_DOWNLOADS
      direction: DESC
      limit: $limit
      offset: 0
      submittedAfter: $after
    ) {
      results {
        name(locale: EN)
        url(locale: EN)
        shortUrl
        illustrationImageUrl(version: DEFAULT)
        likesCount
        downloadsCount
        viewsCount
      }
    }
  }
`;

const CULTS_TOP_DOWNLOADS = `
  query CultsTopDownloads($limit: Int!) {
    creationsBatch(sort: BY_DOWNLOADS, direction: DESC, limit: $limit, offset: 0) {
      results {
        name(locale: EN)
        url(locale: EN)
        shortUrl
        illustrationImageUrl(version: DEFAULT)
        likesCount
        downloadsCount
        viewsCount
      }
    }
  }
`;

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

function scoreFromCults(likes: number, downloads: number): number {
  const score =
    60 +
    Math.log10(Math.max(downloads, 1)) * 6 +
    Math.log10(Math.max(likes, 1)) * 4;
  return Math.min(95, Math.round(score));
}

function cultsAuthHeader(): string | null {
  const username = getRuntimeEnv("CULTS3D_USERNAME", "CULTS3D_USER");
  const apiKey = getRuntimeEnv("CULTS3D_API_KEY", "CULTS3D_API_PASSWORD");
  if (!username || !apiKey) return null;
  return `Basic ${Buffer.from(`${username}:${apiKey}`).toString("base64")}`;
}

export function isCults3dConfigured(): boolean {
  return cultsAuthHeader() !== null;
}

function resolveCultsUrl(item: CultsCreation): string {
  if (item.url?.startsWith("http")) return item.url;
  if (item.shortUrl?.startsWith("http")) return item.shortUrl;
  if (item.shortUrl) return `https://cults3d.com${item.shortUrl.startsWith("/") ? "" : "/"}${item.shortUrl}`;
  return "";
}

async function cultsGraphql(
  auth: string,
  body: Record<string, unknown>
): Promise<CultsCreation[]> {
  const res = await fetch("https://cults3d.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) return [];

  const json = await res.json();
  if (json?.errors?.length) return [];

  return json?.data?.creationsBatch?.results ?? [];
}

/** Cults3D UI: Downloads, last 30 days window */
export async function fetchCults3dTrending(
  limit = SCOUT_POOL_PER_SITE
): Promise<FetchedTrendItem[]> {
  const auth = cultsAuthHeader();
  if (!auth) return [];

  try {
    let results = await cultsGraphql(auth, {
      operationName: "CultsRecentDownloads",
      query: CULTS_RECENT_DOWNLOADS,
      variables: { limit, after: scoutWindowStartIso() },
    });

    if (results.length === 0) {
      results = await cultsGraphql(auth, {
        operationName: "CultsTopDownloads",
        query: CULTS_TOP_DOWNLOADS,
        variables: { limit },
      });
    }

    return results
      .map((item) => {
        const title = String(item.name || "Cults3D Model").slice(0, 120);
        const sourceUrl = resolveCultsUrl(item);
        const imageUrl = item.illustrationImageUrl?.startsWith("http")
          ? item.illustrationImageUrl
          : "";
        const downloadsCount = item.downloadsCount ?? 0;
        const likesCount = item.likesCount ?? 0;

        return {
          title,
          sourceUrl,
          sourceName: "Cults3D",
          imageUrl,
          notes: `Cults3D · last ${SCOUT_WINDOW_DAYS}d downloads. Likes: ${likesCount}, downloads: ${downloadsCount}`,
          trendScore: scoreFromCults(likesCount, downloadsCount),
          category: guessCategory(title),
          downloadsCount,
          likesCount,
          publishedAt: item.publishedAt,
        };
      })
      .filter((item) => item.sourceUrl.startsWith("http") && item.imageUrl.startsWith("http"));
  } catch {
    return [];
  }
}
