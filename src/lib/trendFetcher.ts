import type { Category } from "./config";

export interface FetchedTrendItem {
  title: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  notes: string;
  trendScore: number;
  category: Category;
}

interface RedditPost {
  data: {
    title: string;
    url: string;
    permalink: string;
    selftext: string;
    score: number;
    thumbnail: string;
    preview?: { images?: { source: { url: string } }[] };
    link_flair_text?: string;
  };
}

function decodeRedditUrl(url: string): string {
  return url.replace(/&amp;/g, "&");
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

function scoreFromUpvotes(upvotes: number): number {
  if (upvotes > 2000) return 95;
  if (upvotes > 1000) return 88;
  if (upvotes > 500) return 80;
  if (upvotes > 200) return 72;
  return 65;
}

function isValidImage(url: string): boolean {
  return (
    url.startsWith("http") &&
    !url.includes("self") &&
    !url.includes("default") &&
    !url.endsWith(".gif")
  );
}

const REDDIT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; SCS3D-Scout/1.0; +https://scs3d.com)",
  Accept: "application/json",
};

function parseRedditPosts(posts: RedditPost[], limit: number): FetchedTrendItem[] {
  const items: FetchedTrendItem[] = [];

  for (const post of posts) {
    const d = post.data;
    let imageUrl = "";

    if (d.preview?.images?.[0]?.source?.url) {
      imageUrl = decodeRedditUrl(d.preview.images[0].source.url);
    } else if (isValidImage(d.thumbnail)) {
      imageUrl = d.thumbnail;
    } else if (isValidImage(d.url) && /\.(jpg|jpeg|png|webp)/i.test(d.url)) {
      imageUrl = d.url;
    }

    if (!imageUrl) continue;

    const title = d.title.slice(0, 120);
    items.push({
      title,
      sourceUrl: `https://reddit.com${d.permalink}`,
      sourceName: "Reddit r/3Dprinting",
      imageUrl,
      notes: d.selftext?.slice(0, 200) || `Trending on Reddit with ${d.score} upvotes.`,
      trendScore: scoreFromUpvotes(d.score),
      category: guessCategory(title),
    });

    if (items.length >= limit) break;
  }

  return items;
}

async function fetchRedditJson(url: string): Promise<RedditPost[]> {
  const res = await fetch(url, {
    headers: REDDIT_HEADERS,
    cache: "no-store",
  });
  if (!res.ok) return [];

  const json = await res.json();
  return json?.data?.children ?? [];
}

export async function fetchRedditTrending(limit = 10): Promise<FetchedTrendItem[]> {
  const query = `limit=${limit * 2}`;
  const urls = [
    `https://www.reddit.com/r/3Dprinting/hot.json?${query}`,
    `https://old.reddit.com/r/3Dprinting/hot.json?${query}`,
  ];

  for (const url of urls) {
    try {
      const posts = await fetchRedditJson(url);
      const items = parseRedditPosts(posts, limit);
      if (items.length > 0) return items;
    } catch {
      // try next Reddit endpoint
    }
  }

  return [];
}

export async function fetchPrintablesTrending(): Promise<FetchedTrendItem[]> {
  try {
    const res = await fetch(
      "https://www.printables.com/api/v1/models?order=popular&limit=10",
      { headers: { Accept: "application/json" }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const json = await res.json();
    const results = json?.results ?? json?.items ?? [];

    return results.slice(0, 10).map((m: Record<string, unknown>) => ({
      title: String(m.name || "Printables Model").slice(0, 120),
      sourceUrl: `https://www.printables.com/model/${m.id || ""}`,
      sourceName: "Printables",
      imageUrl: String(m.image || m.thumbnail || ""),
      notes: `Popular on Printables. Downloads: ${m.downloadCount ?? "N/A"}`,
      trendScore: Math.min(90, 60 + Number(m.likeCount || 0) / 10),
      category: guessCategory(String(m.name || "")),
    })).filter((i: FetchedTrendItem) => i.imageUrl.startsWith("http"));
  } catch {
    return [];
  }
}

export async function fetchAllTrending(limit = 10): Promise<FetchedTrendItem[]> {
  const [reddit, printables] = await Promise.all([
    fetchRedditTrending(limit).catch(() => [] as FetchedTrendItem[]),
    fetchPrintablesTrending(),
  ]);

  const merged = [...reddit, ...printables]
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);

  return merged;
}
