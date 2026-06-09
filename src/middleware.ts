import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new NextResponse(
      "Admin locked — set ADMIN_PASSWORD in Vercel Environment Variables, then redeploy.",
      { status: 503, headers: { "Content-Type": "text/plain" } }
    );
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6));
      const colonIndex = decoded.indexOf(":");
      const pwd = decoded.slice(colonIndex + 1);

      if (pwd === password) {
        return NextResponse.next();
      }
    } catch {
      // invalid auth header
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SCS3D Admin", charset="UTF-8"',
      "Content-Type": "text/plain",
    },
  });
}

export const config = {
  matcher: ["/admin", "/admin/(.*)", "/api/scout/(.*)"],
};
