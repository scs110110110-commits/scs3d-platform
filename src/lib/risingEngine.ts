import type { FetchedTrendItem } from "@/lib/trendFetcher";
import { itemKey, type ScoutSnapshot } from "@/lib/scoutSnapshot";

export interface RisingItem extends FetchedTrendItem {
  risingScore: number;
  rankDelta: number;
  scoreDelta: number;
  isNew: boolean;
  currentRank: number;
  previousRank: number | null;
}

const DEFAULT_TOP = 5;

export function computeRising(
  previous: ScoutSnapshot | null,
  current: FetchedTrendItem[],
  topN = DEFAULT_TOP
): RisingItem[] {
  const prevByKey = new Map(
    (previous?.items ?? []).map((item) => [item.key, item])
  );

  const ranked: RisingItem[] = current.map((item, index) => {
    const key = itemKey(item.sourceUrl);
    const prev = prevByKey.get(key);
    const currentRank = index + 1;

    if (!prev) {
      return {
        ...item,
        risingScore: 120 - currentRank * 3 + item.trendScore * 0.2,
        rankDelta: 0,
        scoreDelta: 0,
        isNew: true,
        currentRank,
        previousRank: null,
      };
    }

    const rankDelta = prev.rank - currentRank;
    const scoreDelta = item.trendScore - prev.trendScore;
    const risingScore =
      rankDelta * 18 + scoreDelta * 3 + Math.max(0, 15 - currentRank * 2);

    return {
      ...item,
      risingScore,
      rankDelta,
      scoreDelta,
      isNew: false,
      currentRank,
      previousRank: prev.rank,
    };
  });

  if (!previous) {
    return ranked
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, topN)
      .map((item) => ({
        ...item,
        risingScore: item.trendScore,
        isNew: true,
      }));
  }

  return ranked
    .filter((item) => item.isNew || item.rankDelta > 0 || item.scoreDelta > 0)
    .sort((a, b) => b.risingScore - a.risingScore)
    .slice(0, topN);
}
