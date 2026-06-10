import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
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

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)", "/api/scout/(.*)"],
};
