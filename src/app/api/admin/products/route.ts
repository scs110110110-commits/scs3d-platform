import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import {
  persistAllProductImages,
  productsForClientResponse,
} from "@/lib/productImageStore";
import { parseProductsJson, prepareProductsForSave } from "@/lib/productImport";
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

export async function GET(request: Request) {
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
    const products = await loadAllProducts();
    const origin = new URL(request.url).origin;
    return NextResponse.json({
      success: true,
      count: products.length,
      products: productsForClientResponse(products, origin),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load products" },
      { status: 500 }
    );
  }
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
    let products: Product[];

    if (body?.import === true) {
      products = parseProductsJson(body.data ?? body.products ?? body);
    } else {
      const list = body?.products as Product[] | undefined;
      if (!Array.isArray(list)) {
        return NextResponse.json({ error: "products array required" }, { status: 400 });
      }
      products = list;
    }

    const externalized = await persistAllProductImages(products);
    const prepared = prepareProductsForSave(externalized);
    const saved = await saveAllProducts(prepared.products);

    if (!saved.ok) {
      return NextResponse.json(
        { error: saved.error || "Failed to save products" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: prepared.products.length,
      warning: prepared.warning,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 400 }
    );
  }
}
