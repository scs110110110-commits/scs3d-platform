import { SCOUT_WINDOW_DAYS } from "@/lib/scoutConfig";
import { getRuntimeEnv } from "@/lib/env";
import type { RisingItem } from "@/lib/risingEngine";

export function isTelegramConfigured(): boolean {
  return Boolean(
    getRuntimeEnv("TELEGRAM_BOT_TOKEN") && getRuntimeEnv("TELEGRAM_CHAT_ID")
  );
}

function risingLabel(item: RisingItem, hasBaseline: boolean): string {
  const parts: string[] = [];

  if (hasBaseline) {
    if (item.downloadDelta > 0) parts.push(`+${item.downloadDelta} dl/24h`);
    if (item.likeDelta > 0) parts.push(`+${item.likeDelta} likes/24h`);
    if (parts.length === 0 && item.isNew) parts.push("NEW in pool");
    if (parts.length === 0) parts.push("steady");
  } else {
    parts.push(`${item.downloadsCount.toLocaleString()} dl (30d window)`);
  }

  return parts.join(" · ");
}

export function formatDailyRisingReport(
  items: RisingItem[],
  options: {
    hasBaseline: boolean;
    snapshotSaved: boolean;
    fetchedCount: number;
    cultsCount: number;
    printablesCount: number;
    poolSize: number;
  }
): string {
  const date = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    "📈 SCS3D Daily Rising Report",
    `📅 ${date}`,
    `🪟 Window: last ${SCOUT_WINDOW_DAYS} days · Cults=downloads · Printables=trending proxy`,
    "",
  ];

  if (!options.hasBaseline) {
    lines.push(
      "ℹ️ First run — ranked by downloads in the 30-day window. Velocity (24h deltas) starts tomorrow.",
      ""
    );
  }

  if (items.length === 0) {
    lines.push("No rising items detected today.");
  } else {
    const cults = items.filter((item) => item.sourceName === "Cults3D");
    const printables = items.filter((item) => item.sourceName === "Printables");

    let index = 0;
    if (cults.length > 0) {
      lines.push(`🔥 Cults3D · downloads (${cults.length})`, "");
      for (const item of cults) {
        index += 1;
        lines.push(
          `${index}. ${item.title}`,
          `   ${risingLabel(item, options.hasBaseline)}`,
          `   ${item.sourceUrl}`,
          ""
        );
      }
    }

    if (printables.length > 0) {
      lines.push(`🖨️ Printables · past ${SCOUT_WINDOW_DAYS}d (${printables.length})`, "");
      for (const item of printables) {
        index += 1;
        lines.push(
          `${index}. ${item.title}`,
          `   ${risingLabel(item, options.hasBaseline)}`,
          `   ${item.sourceUrl}`,
          ""
        );
      }
    }
  }

  lines.push(
    `Scanned ${options.poolSize} models → ${options.fetchedCount} in report (${options.cultsCount} Cults3D + ${options.printablesCount} Printables).`,
    options.snapshotSaved
      ? "Metrics saved — tomorrow compares 24h download/like growth."
      : "⚠️ Add Vercel KV to track daily velocity (recommended).",
    "",
    "Add to catalog: scs3d.com/admin/scout"
  );

  return lines.join("\n");
}

export async function sendTelegramMessage(text: string): Promise<void> {
  const token = getRuntimeEnv("TELEGRAM_BOT_TOKEN");
  const chatId = getRuntimeEnv("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: false,
    }),
  });

  const data = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || !data.ok) {
    throw new Error(data.description || `Telegram API error (${res.status})`);
  }
}
