import { Redis } from "@upstash/redis";
import { getRuntimeEnv } from "@/lib/env";
import type { FetchedTrendItem } from "@/lib/trendFetcher";

const SNAPSHOT_KEY = "scs3d:scout:snapshot";

export interface SnapshotEntry {
  key: string;
  title: string;
  sourceUrl: string;
  sourceName: string;
  trendScore: number;
  rank: number;
  downloadsCount: number;
  likesCount: number;
  publishedAt?: string;
}

export interface ScoutSnapshot {
  date: string;
  fetchedAt: string;
  items: SnapshotEntry[];
}

export function itemKey(sourceUrl: string): string {
  return sourceUrl.trim().toLowerCase().replace(/\/$/, "");
}

function getRedis(): Redis | null {
  const url = getRuntimeEnv("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
  const token = getRuntimeEnv("KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isSnapshotStorageConfigured(): boolean {
  return getRedis() !== null;
}

export function buildSnapshot(items: FetchedTrendItem[]): ScoutSnapshot {
  const date = new Date().toISOString().slice(0, 10);
  return {
    date,
    fetchedAt: new Date().toISOString(),
    items: items.map((item, index) => ({
      key: itemKey(item.sourceUrl),
      title: item.title,
      sourceUrl: item.sourceUrl,
      sourceName: item.sourceName,
      trendScore: item.trendScore,
      rank: index + 1,
      downloadsCount: item.downloadsCount,
      likesCount: item.likesCount,
      publishedAt: item.publishedAt,
    })),
  };
}

export async function loadSnapshot(): Promise<ScoutSnapshot | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const data = await redis.get<ScoutSnapshot>(SNAPSHOT_KEY);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function saveSnapshot(snapshot: ScoutSnapshot): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  try {
    await redis.set(SNAPSHOT_KEY, snapshot);
    return true;
  } catch {
    return false;
  }
}
