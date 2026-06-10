import { NextResponse } from "next/server";
import { capProductsForResponse } from "@/lib/productImport";
import {
  getPublishedProducts,
  isProductStoreConfigured,
  loadAllProducts,
} from "@/lib/productStore";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isProductStoreConfigured()) {
    return NextResponse.json(
      { error: "Product store not configured — link Upstash Redis in Vercel" },
      { status: 503 }
    );
  }

  try {
    const products = await loadAllProducts();
    const published = getPublishedProducts(products);
    const capped = capProductsForResponse(published);
    return NextResponse.json({
      success: true,
      count: capped.products.length,
      products: capped.products,
      warning: capped.warning,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load catalog" },
      { status: 500 }
    );
  }
}
