import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }
    return new NextResponse("Admin password not configured on server.", {
      status: 503,
    });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice(6));
    const colonIndex = decoded.indexOf(":");
    const pwd = decoded.slice(colonIndex + 1);

    if (pwd === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SCS3D Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
