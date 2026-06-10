import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminToken,
  getAdminCookieOptions,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return NextResponse.json(
      { error: "Admin password not configured on server." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const input = String(body.password || "");

  if (input !== password) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const token = await createAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Could not create session." }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, token, getAdminCookieOptions());
  return response;
}
