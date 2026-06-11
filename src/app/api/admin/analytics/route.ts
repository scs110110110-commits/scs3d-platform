import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadAnalytics } from "@/lib/analyticsStore";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analytics = await loadAnalytics();
  return NextResponse.json({ success: true, analytics });
}
