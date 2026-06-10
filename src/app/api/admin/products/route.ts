import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import {
  isProductStoreConfigured,
  loadAllProducts,
  saveAllProducts,
} from "@/lib/productStore";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isProductStoreConfigured()) {
    return NextResponse.json(
      { error: "Product store not configured — link Upstash Redis in Vercel" },
      { status: 503 }
    );
  }

  const products = await loadAllProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isProductStoreConfigured()) {
    return NextResponse.json(
      { error: "Product store not configured — link Upstash Redis in Vercel" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const products = body?.products as Product[] | undefined;

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "products array required" }, { status: 400 });
    }

    const saved = await saveAllProducts(products);
    if (!saved) {
      return NextResponse.json({ error: "Failed to save products" }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: products.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 }
    );
  }
}
