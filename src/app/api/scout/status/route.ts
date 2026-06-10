import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isCults3dConfigured } from "@/lib/cults3dFetcher";
import { isSnapshotStorageConfigured, loadSnapshot } from "@/lib/scoutSnapshot";
import { isTelegramConfigured } from "@/lib/telegram";
import { getRuntimeEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await loadSnapshot();

  return NextResponse.json({
    telegramConfigured: isTelegramConfigured(),
    cults3dConfigured: isCults3dConfigured(),
    snapshotConfigured: isSnapshotStorageConfigured(),
    cronSecretConfigured: Boolean(getRuntimeEnv("CRON_SECRET")),
    snapshot,
    cronSchedule: "0 13 * * * (UTC) — ~09:00 Kitchener-Waterloo (EDT)",
    cronPath: "/api/cron/daily-rising",
  });
}
