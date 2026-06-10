import type { Category } from "./config";
import { fetchCults3dTrending } from "./cults3dFetcher";

export interface FetchedTrendItem {
  title: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  notes: string;
  trendScore: number;
  category: Category;
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
  image?: { filePath?: string };
}

const PRINTABLES_GRAPHQL = `
  query SearchPopular($limit: Int!) {
    result: searchPrints2(query: "", printType: print, limit: $limit, ordering: popular) {
      items {
        id
        name
        slug
        likesCount
        downloadCount
        image { filePath }
      }
    }
  }
`;

export async function fetchPrintablesTrending(limit = 10): Promise<FetchedTrendItem[]> {
  try {
    const res = await fetch("https://api.printables.com/graphql/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; SCS3D-Scout/1.0; +https://scs3d.com)",
      },
      body: JSON.stringify({
        operationName: "SearchPopular",
        query: PRINTABLES_GRAPHQL,
        variables: { limit },
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
        return {
          title,
          sourceUrl: `https://www.printables.com/model/${m.id}-${m.slug}`,
          sourceName: "Printables",
          imageUrl,
          notes: `Popular on Printables. Downloads: ${m.downloadCount ?? "N/A"}, likes: ${m.likesCount ?? "N/A"}`,
          trendScore: Math.min(95, 65 + Math.log10(Math.max(m.downloadCount || 1, 1)) * 8),
          category: guessCategory(title),
        };
      })
      .filter((i) => i.imageUrl.startsWith("http"));
  } catch {
    return [];
  }
}

export async function fetchAllTrending(limit = 10): Promise<FetchedTrendItem[]> {
  const [cults, printables] = await Promise.all([
    fetchCults3dTrending(limit).catch(() => [] as FetchedTrendItem[]),
    fetchPrintablesTrending(limit),
  ]);

  const merged = [...cults, ...printables]
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);

  return merged;
}
