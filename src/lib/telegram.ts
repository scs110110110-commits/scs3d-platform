import { getRuntimeEnv } from "@/lib/env";
import type { RisingItem } from "@/lib/risingEngine";

export function isTelegramConfigured(): boolean {
  return Boolean(
    getRuntimeEnv("TELEGRAM_BOT_TOKEN") && getRuntimeEnv("TELEGRAM_CHAT_ID")
  );
}

function risingLabel(item: RisingItem): string {
  if (item.isNew) return "NEW";
  const parts: string[] = [];
  if (item.rankDelta > 0) parts.push(`+${item.rankDelta} ranks`);
  if (item.scoreDelta > 0) parts.push(`+${item.scoreDelta} score`);
  return parts.join(", ") || "rising";
}

export function formatDailyRisingReport(
  items: RisingItem[],
  options: {
    hasBaseline: boolean;
    snapshotSaved: boolean;
    fetchedCount: number;
  }
): string {
  const date = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    "📈 SCS3D Daily Rising Report",
    `📅 ${date}`,
    "",
  ];

  if (!options.hasBaseline) {
    lines.push(
      "ℹ️ First run — showing today's top picks. Rising deltas start tomorrow.",
      ""
    );
  }

  if (items.length === 0) {
    lines.push("No rising items detected today.");
  } else {
    items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.title}`,
        `   ${item.sourceName} · score ${Math.round(item.trendScore)} · ${risingLabel(item)}`,
        `   ${item.sourceUrl}`,
        ""
      );
    });
  }

  lines.push(
    `Fetched ${options.fetchedCount} items from Reddit + Printables.`,
    options.snapshotSaved
      ? "Snapshot saved for tomorrow's comparison."
      : "⚠️ Snapshot not saved — add Vercel KV / Upstash env vars.",
    "",
    "Add to catalog manually: scs3d.com/admin/scout"
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
