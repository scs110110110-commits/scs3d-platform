import { NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/cronAuth";
import { computeRising } from "@/lib/risingEngine";
import {
  buildSnapshot,
  isSnapshotStorageConfigured,
  loadSnapshot,
  saveSnapshot,
} from "@/lib/scoutSnapshot";
import { fetchAllTrending } from "@/lib/trendFetcher";
import {
  formatDailyRisingReport,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await fetchAllTrending(20);
    const previous = await loadSnapshot();
    const rising = computeRising(previous, items, 5);
    const snapshot = buildSnapshot(items);
    const snapshotSaved = await saveSnapshot(snapshot);

    const report = formatDailyRisingReport(rising, {
      hasBaseline: Boolean(previous),
      snapshotSaved,
      fetchedCount: items.length,
    });

    let telegramSent = false;
    if (isTelegramConfigured()) {
      await sendTelegramMessage(report);
      telegramSent = true;
    }

    return NextResponse.json({
      success: true,
      fetchedAt: snapshot.fetchedAt,
      fetchedCount: items.length,
      risingCount: rising.length,
      hasBaseline: Boolean(previous),
      snapshotConfigured: isSnapshotStorageConfigured(),
      snapshotSaved,
      telegramConfigured: isTelegramConfigured(),
      telegramSent,
      rising: rising.map((item) => ({
        title: item.title,
        sourceUrl: item.sourceUrl,
        sourceName: item.sourceName,
        trendScore: item.trendScore,
        risingScore: Math.round(item.risingScore * 10) / 10,
        rankDelta: item.rankDelta,
        scoreDelta: item.scoreDelta,
        isNew: item.isNew,
        currentRank: item.currentRank,
        previousRank: item.previousRank,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Daily rising cron failed" },
      { status: 500 }
    );
  }
}
