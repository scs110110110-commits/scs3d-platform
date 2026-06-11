import { getRedis, isKvConfigured } from "@/lib/kv";

const TOTAL_KEY = "scs3d:analytics:pages:total";
const DAILY_PREFIX = "scs3d:analytics:pages:daily:";

export const PAGE_LABELS: Record<string, string> = {
  "/": "Home / Catalog",
  "/solutions": "Custom Solutions",
  "/custom": "Custom Request",
};

export function normalizePagePath(path: string): string {
  const clean = (path || "/").split("?")[0].split("#")[0] || "/";
  return clean.startsWith("/") ? clean : `/${clean}`;
}

export function getPageLabel(path: string): string {
  return PAGE_LABELS[path] ?? path;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dailyKey(date: string): string {
  return `${DAILY_PREFIX}${date}`;
}

function lastNDates(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function parseCountMap(raw: Record<string, unknown> | null | undefined): Record<string, number> {
  if (!raw) return {};
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    const count = Number(value);
    if (Number.isFinite(count) && count > 0) out[key] = count;
  }
  return out;
}

export async function recordPageView(path: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const page = normalizePagePath(path);
  const date = todayKey();

  await Promise.all([
    redis.hincrby(TOTAL_KEY, page, 1),
    redis.hincrby(dailyKey(date), page, 1),
  ]);
}

export interface AnalyticsSnapshot {
  configured: boolean;
  total: Record<string, number>;
  today: Record<string, number>;
  daily: Record<string, Record<string, number>>;
  days: string[];
  totalViews: number;
  todayViews: number;
}

export async function loadAnalytics(): Promise<AnalyticsSnapshot> {
  if (!isKvConfigured()) {
    return {
      configured: false,
      total: {},
      today: {},
      daily: {},
      days: [],
      totalViews: 0,
      todayViews: 0,
    };
  }

  const redis = getRedis();
  if (!redis) {
    return {
      configured: false,
      total: {},
      today: {},
      daily: {},
      days: [],
      totalViews: 0,
      todayViews: 0,
    };
  }

  const days = lastNDates(7);
  const today = todayKey();

  const [totalRaw, todayRaw, ...dailyRows] = await Promise.all([
    redis.hgetall<Record<string, unknown>>(TOTAL_KEY),
    redis.hgetall<Record<string, unknown>>(dailyKey(today)),
    ...days.map((date) => redis.hgetall<Record<string, unknown>>(dailyKey(date))),
  ]);

  const total = parseCountMap(totalRaw);
  const todayCounts = parseCountMap(todayRaw);
  const daily: Record<string, Record<string, number>> = {};

  days.forEach((date, index) => {
    daily[date] = parseCountMap(dailyRows[index]);
  });

  const sum = (map: Record<string, number>) =>
    Object.values(map).reduce((acc, n) => acc + n, 0);

  return {
    configured: true,
    total,
    today: todayCounts,
    daily,
    days,
    totalViews: sum(total),
    todayViews: sum(todayCounts),
  };
}
