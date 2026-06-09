import { NextResponse } from "next/server";
import { fetchAllTrending } from "@/lib/trendFetcher";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const authHeader = request.headers.get("authorization");

  if (password) {
    const valid =
      authHeader?.startsWith("Basic ") &&
      (() => {
        try {
          const decoded = atob(authHeader.slice(6));
          return decoded.slice(decoded.indexOf(":") + 1) === password;
        } catch {
          return false;
        }
      })();

    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 20);
    const items = await fetchAllTrending(limit);

    return NextResponse.json({
      success: true,
      count: items.length,
      fetchedAt: new Date().toISOString(),
      items,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fetch failed" },
      { status: 500 }
    );
  }
}
