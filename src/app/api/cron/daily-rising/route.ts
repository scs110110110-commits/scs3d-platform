import { NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/cronAuth";
import { computeVelocityReport, fillReportItems } from "@/lib/risingEngine";
import { DAILY_REPORT_TOTAL } from "@/lib/scoutConfig";
import {
  buildSnapshot,
  isSnapshotStorageConfigured,
  loadSnapshot,
  saveSnapshot,
} from "@/lib/scoutSnapshot";
import { fetchScoutPool } from "@/lib/trendFetcher";
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
    const pool = await fetchScoutPool();
    if (pool.length === 0) {
      return NextResponse.json(
        { error: "No trending items fetched from Cults3D or Printables" },
        { status: 502 }
      );
    }

    const previous = await loadSnapshot();
    const risingRaw = computeVelocityReport(previous, pool);
    const rising = fillReportItems(risingRaw, pool, DAILY_REPORT_TOTAL);
    const snapshot = buildSnapshot(pool);
    const snapshotSaved = await saveSnapshot(snapshot);

    const cultsCount = rising.filter((item) => item.sourceName === "Cults3D").length;
    const printablesCount = rising.filter((item) => item.sourceName === "Printables").length;

    const report = formatDailyRisingReport(rising, {
      hasBaseline: Boolean(previous?.items.length),
      snapshotSaved,
      fetchedCount: rising.length,
      cultsCount,
      printablesCount,
      poolSize: pool.length,
    });

    let telegramSent = false;
    if (isTelegramConfigured()) {
      await sendTelegramMessage(report);
      telegramSent = true;
    }

    return NextResponse.json({
      success: true,
      fetchedAt: snapshot.fetchedAt,
      poolSize: pool.length,
      fetchedCount: rising.length,
      risingCount: rising.length,
      hasBaseline: Boolean(previous?.items.length),
      snapshotConfigured: isSnapshotStorageConfigured(),
      snapshotSaved,
      telegramConfigured: isTelegramConfigured(),
      telegramSent,
      rising: rising.map((item) => ({
        title: item.title,
        sourceUrl: item.sourceUrl,
        sourceName: item.sourceName,
        trendScore: item.trendScore,
        downloadsCount: item.downloadsCount,
        downloadDelta: item.downloadDelta,
        likeDelta: item.likeDelta,
        risingScore: Math.round(item.risingScore * 10) / 10,
        isNew: item.isNew,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Daily rising cron failed" },
      { status: 500 }
    );
  }
}
