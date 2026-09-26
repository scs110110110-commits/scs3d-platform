"use client";

import { TREND_BADGES } from "@/lib/config";
import type { Product } from "@/lib/types";
import OrderActions from "./OrderActions";
import ProductImageCarousel from "./ProductImageCarousel";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const badge = TREND_BADGES[product.status];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)]">
      <div className="relative">
        <ProductImageCarousel
          product={product}
          variant="card"
          onImageClick={() => onSelect?.(product)}
        />
        <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground)] backdrop-blur-sm">
          {badge.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
          {product.category}
        </p>
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold tracking-tight text-[var(--foreground)]">
          {product.title}
        </h3>
        <p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--muted)]">
          {product.shortDescription || product.description}
        </p>

        <div className="mb-3 flex items-center justify-between border-t border-[var(--border)] pt-2.5 font-mono text-[10px] text-[var(--muted-2)]">
          <span>{product.material || "PLA"}</span>
          <span>{product.socialProof.toLocaleString()} views</span>
        </div>

        <OrderActions product={product} variant="card" />
      </div>
    </article>
  );
}
