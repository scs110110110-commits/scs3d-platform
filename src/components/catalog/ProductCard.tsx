"use client";

import { TREND_BADGES } from "@/lib/config";
import type { Product } from "@/lib/types";
import { openWhatsAppOrder } from "@/lib/whatsapp";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const badge = TREND_BADGES[product.status];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition hover:border-zinc-600 hover:shadow-xl hover:shadow-cyan-500/5">
      <button
        type="button"
        onClick={() => onSelect?.(product)}
        className="relative aspect-square overflow-hidden bg-zinc-800 text-left"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${
            badge.color === "emerald"
              ? "bg-emerald-500/90 text-white"
              : badge.color === "orange"
                ? "bg-orange-500/90 text-white"
                : badge.color === "red"
                  ? "bg-red-500/90 text-white"
                  : "bg-cyan-500/90 text-white"
          }`}
        >
          {badge.emoji} {badge.label}
        </span>
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-violet-600/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            ⭐ Featured
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
          {product.category}
        </div>
        <h3 className="mb-1 line-clamp-1 text-lg font-bold text-white">
          {product.title}
        </h3>
        <p className="mb-3 line-clamp-2 flex-1 text-sm text-zinc-400">
          {product.shortDescription}
        </p>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-2xl font-bold text-cyan-400">
            ${product.price}
            <span className="text-sm font-normal text-zinc-500"> CAD</span>
          </span>
          <span className="text-xs text-zinc-500">
            👀 {product.socialProof}+ views
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => openWhatsAppOrder(product)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500"
        >
          💬 Order on WhatsApp
        </button>
      </div>
    </article>
  );
}
