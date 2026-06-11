import { NextResponse } from "next/server";
import { normalizePagePath, recordPageView } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";

const PUBLIC_PATHS = new Set(["/", "/solutions", "/custom"]);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = normalizePagePath(String(body?.path || "/"));

    if (!PUBLIC_PATHS.has(path)) {
      return NextResponse.json({ success: true, skipped: true });
    }

    await recordPageView(path);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
