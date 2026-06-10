import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";

const PUBLIC_ADMIN_API = new Set(["/api/admin/login", "/api/admin/logout"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || PUBLIC_ADMIN_API.has(pathname)) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse(
      "Admin locked — set ADMIN_PASSWORD in Vercel Environment Variables, then redeploy.",
      { status: 503, headers: { "Content-Type": "text/plain" } }
    );
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if (token && (await verifyAdminToken(token))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized — log in again" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)", "/api/scout/(.*)", "/api/admin/(.*)"],
};
