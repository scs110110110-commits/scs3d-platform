"use client";

import { TREND_BADGES } from "@/lib/config";
import type { Product } from "@/lib/types";
import { ORDER_BUTTON_LABEL, openWhatsAppOrder } from "@/lib/whatsapp";

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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 transition duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/40">
      <button
        type="button"
        onClick={() => onSelect?.(product)}
        className="relative aspect-[4/3] overflow-hidden bg-zinc-800 text-left"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md ${BADGE_STYLES[badge.color]}`}
        >
          {badge.label}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {product.category}
        </p>
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold tracking-tight text-white">
          {product.title}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-400">
          {product.shortDescription}
        </p>

        <div className="mb-4 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs text-zinc-500">
          <span>{product.material}</span>
          <span>{product.socialProof.toLocaleString()} views</span>
        </div>

        <button
          onClick={() => openWhatsAppOrder(product)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          {ORDER_BUTTON_LABEL}
        </button>
      </div>
    </article>
  );
}
