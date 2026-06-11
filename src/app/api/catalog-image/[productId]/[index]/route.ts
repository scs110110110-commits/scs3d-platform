import { NextResponse } from "next/server";
import { loadProductImageData } from "@/lib/productImageStore";
import { isProductStoreConfigured, loadAllProducts } from "@/lib/productStore";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ productId: string; index: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  if (!isProductStoreConfigured()) {
    return new NextResponse("Image store not configured", { status: 503 });
  }

  const { productId, index: indexRaw } = await params;
  const index = Number(indexRaw);
  if (!Number.isInteger(index) || index < 0) {
    return new NextResponse("Invalid image index", { status: 400 });
  }

  const products = await loadAllProducts();
  const data = await loadProductImageData(productId, index, products);
  if (!data) {
    return new NextResponse("Image not found", { status: 404 });
  }

  if (data.startsWith("http://") || data.startsWith("https://")) {
    return NextResponse.redirect(data);
  }

  if (!data.startsWith("data:image/")) {
    return new NextResponse("Unsupported image format", { status: 415 });
  }

  const comma = data.indexOf(",");
  if (comma < 0) {
    return new NextResponse("Invalid image data", { status: 415 });
  }

  const meta = data.slice(0, comma);
  const base64 = data.slice(comma + 1);
  const mime = meta.match(/^data:(.*?);base64$/)?.[1] || "image/jpeg";
  const buffer = Buffer.from(base64, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
