import { DAILY_REPORT_PER_SITE } from "@/lib/scoutConfig";
import type { FetchedTrendItem } from "@/lib/trendFetcher";
import { itemKey, type ScoutSnapshot } from "@/lib/scoutSnapshot";

export interface RisingItem extends FetchedTrendItem {
  risingScore: number;
  rankDelta: number;
  scoreDelta: number;
  downloadDelta: number;
  likeDelta: number;
  isNew: boolean;
  currentRank: number;
  previousRank: number | null;
}

function velocityScore(
  item: FetchedTrendItem,
  prev: ScoutSnapshot["items"][0] | undefined,
  hasBaseline: boolean
): { score: number; downloadDelta: number; likeDelta: number; isNew: boolean } {
  if (!hasBaseline || !prev) {
    return {
      score: item.downloadsCount * 0.15 + item.likesCount * 0.08,
      downloadDelta: 0,
      likeDelta: 0,
      isNew: true,
    };
  }

  const downloadDelta = Math.max(0, item.downloadsCount - prev.downloadsCount);
  const likeDelta = Math.max(0, item.likesCount - prev.likesCount);
  const score = downloadDelta * 2.5 + likeDelta * 1.2;

  return {
    score,
    downloadDelta,
    likeDelta,
    isNew: false,
  };
}

function rankPool(
  pool: FetchedTrendItem[],
  previous: ScoutSnapshot | null,
  sourceName: string,
  topN: number
): RisingItem[] {
  const prevByKey = new Map(
    (previous?.items ?? []).map((item) => [item.key, item])
  );
  const hasBaseline = Boolean(previous?.items.length);

  const subset = pool.filter((item) => item.sourceName === sourceName);

  const ranked = subset
    .map((item, index) => {
      const key = itemKey(item.sourceUrl);
      const prev = prevByKey.get(key);
      const velocity = velocityScore(item, prev, hasBaseline);
      const rankDelta = prev ? prev.rank - (index + 1) : 0;
      const scoreDelta = prev ? item.trendScore - prev.trendScore : 0;

      return {
        ...item,
        risingScore: velocity.score,
        rankDelta,
        scoreDelta,
        downloadDelta: velocity.downloadDelta,
        likeDelta: velocity.likeDelta,
        isNew: velocity.isNew,
        currentRank: index + 1,
        previousRank: prev?.rank ?? null,
      };
    })
    .sort((a, b) => b.risingScore - a.risingScore);

  if (!hasBaseline) {
    return ranked
      .sort((a, b) => b.downloadsCount - a.downloadsCount)
      .slice(0, topN)
      .map((item, i) => ({
        ...item,
        currentRank: i + 1,
        isNew: true,
        risingScore: item.downloadsCount,
      }));
  }

  const movers = ranked.filter(
    (item) => item.downloadDelta > 0 || item.likeDelta > 0 || item.isNew
  );

  const picked = (movers.length > 0 ? movers : ranked).slice(0, topN);
  return picked.map((item, i) => ({ ...item, currentRank: i + 1 }));
}

/** Top N per site by 24h download/like velocity (or 30d downloads on first run) */
export function computeVelocityReport(
  previous: ScoutSnapshot | null,
  pool: FetchedTrendItem[],
  perSite = DAILY_REPORT_PER_SITE
): RisingItem[] {
  const cults = rankPool(pool, previous, "Cults3D", perSite);
  const printables = rankPool(pool, previous, "Printables", perSite);
  return [...cults, ...printables];
}

/** @deprecated use computeVelocityReport */
export function computeRising(
  previous: ScoutSnapshot | null,
  current: FetchedTrendItem[],
  topN = 10
): RisingItem[] {
  return computeVelocityReport(previous, current, Math.ceil(topN / 2));
}

export function fillReportItems(
  rising: RisingItem[],
  pool: FetchedTrendItem[],
  count = DAILY_REPORT_PER_SITE * 2
): RisingItem[] {
  const seen = new Set<string>();
  const result: RisingItem[] = [];

  for (const item of rising) {
    if (result.length >= count) break;
    const key = itemKey(item.sourceUrl);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  for (const item of pool) {
    if (result.length >= count) break;
    const key = itemKey(item.sourceUrl);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      ...item,
      risingScore: item.downloadsCount,
      rankDelta: 0,
      scoreDelta: 0,
      downloadDelta: 0,
      likeDelta: 0,
      isNew: true,
      currentRank: result.length + 1,
      previousRank: null,
    });
  }

  return result;
}
