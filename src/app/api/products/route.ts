import { NextResponse } from "next/server";
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

  const products = await loadAllProducts();
  return NextResponse.json({
    success: true,
    count: products.length,
    products: getPublishedProducts(products),
  });
}
