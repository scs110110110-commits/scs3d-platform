import { NextResponse } from "next/server";
import { productsForClientResponse } from "@/lib/productImageStore";
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
    return NextResponse.json({
      success: true,
      count: published.length,
      products: productsForClientResponse(published),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load catalog" },
      { status: 500 }
    );
  }
}
