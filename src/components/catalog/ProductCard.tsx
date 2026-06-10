"use client";

import { TREND_BADGES } from "@/lib/config";
import type { Product } from "@/lib/types";
import OrderActions from "./OrderActions";
import ProductImageCarousel from "./ProductImageCarousel";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

const BADGE_STYLES: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  orange: "bg-orange-500/15 text-orange-300 border-orange-500/20",
  red: "bg-red-500/15 text-red-300 border-red-500/20",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
};

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const badge = TREND_BADGES[product.status];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 transition duration-300 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/30">
      <div className="relative">
        <ProductImageCarousel
          product={product}
          variant="card"
          onImageClick={() => onSelect?.(product)}
        />
        <span
          className={`pointer-events-none absolute left-2 top-2 z-10 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md ${BADGE_STYLES[badge.color]}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {product.category}
        </p>
        <h3 className="mb-1 line-clamp-1 text-sm font-semibold tracking-tight text-white">
          {product.title}
        </h3>
        <p className="mb-2 line-clamp-2 flex-1 text-[11px] leading-relaxed text-zinc-400">
          {product.shortDescription}
        </p>

        <div className="mb-2 flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[10px] text-zinc-500">
          <span>{product.material}</span>
          <span>{product.socialProof.toLocaleString()} views</span>
        </div>

        <OrderActions product={product} variant="card" />
      </div>
    </article>
  );
}
