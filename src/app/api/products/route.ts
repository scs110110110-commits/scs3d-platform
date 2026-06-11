import { NextResponse } from "next/server";
import type { CatalogSection } from "@/lib/config";
import { CATALOG_SECTIONS } from "@/lib/config";
import { productsForClientResponse } from "@/lib/productImageStore";
import {
  getPublishedProducts,
  isProductStoreConfigured,
  loadAllProducts,
} from "@/lib/productStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isProductStoreConfigured()) {
    return NextResponse.json(
      { error: "Product store not configured — link Upstash Redis in Vercel" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const sectionParam = searchParams.get("section");
    const section = CATALOG_SECTIONS.includes(sectionParam as CatalogSection)
      ? (sectionParam as CatalogSection)
      : "trending";

    const products = await loadAllProducts();
    const published = getPublishedProducts(products, section);
    const origin = new URL(request.url).origin;
    return NextResponse.json({
      success: true,
      count: published.length,
      products: productsForClientResponse(published, origin),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load catalog" },
      { status: 500 }
    );
  }
}
