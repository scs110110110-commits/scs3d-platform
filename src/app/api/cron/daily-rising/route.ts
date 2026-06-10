import { NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/cronAuth";
import { computeRising, fillReportItems } from "@/lib/risingEngine";
import {
  buildSnapshot,
  isSnapshotStorageConfigured,
  loadSnapshot,
  saveSnapshot,
} from "@/lib/scoutSnapshot";
import {
  DAILY_REPORT_TOTAL,
  fetchBalancedTrending,
} from "@/lib/trendFetcher";
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
    const items = await fetchBalancedTrending();
    if (items.length === 0) {
      return NextResponse.json(
        { error: "No trending items fetched from Cults3D or Printables" },
        { status: 502 }
      );
    }

    const previous = await loadSnapshot();
    const risingRaw = computeRising(previous, items, DAILY_REPORT_TOTAL);
    const rising = fillReportItems(risingRaw, items, DAILY_REPORT_TOTAL);
    const snapshot = buildSnapshot(items);
    const snapshotSaved = await saveSnapshot(snapshot);

    const cultsCount = rising.filter((item) => item.sourceName === "Cults3D").length;
    const printablesCount = rising.filter((item) => item.sourceName === "Printables").length;

    const report = formatDailyRisingReport(rising, {
      hasBaseline: Boolean(previous),
      snapshotSaved,
      fetchedCount: rising.length,
      cultsCount,
      printablesCount,
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
