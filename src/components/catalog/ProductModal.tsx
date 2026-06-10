"use client";

import { useEffect } from "react";
import { TREND_BADGES } from "@/lib/config";
import type { Product } from "@/lib/types";
import OrderActions from "./OrderActions";
import ProductImageCarousel from "./ProductImageCarousel";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [product]);

  if (!product) return null;

  const badge = TREND_BADGES[product.status];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:items-center sm:p-3">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))]">
          <p className="truncate pr-2 text-sm font-medium text-zinc-300">{product.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-base text-zinc-200 hover:bg-zinc-700"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ProductImageCarousel key={product.id} product={product} variant="modal" />

          <div className="p-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-500">
              {product.category}
            </span>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500/90">
              {badge.emoji} {badge.label} · {product.trendScore}
            </span>
          </div>

          <h2 className="mb-1.5 text-lg font-semibold text-zinc-100">{product.title}</h2>
          <p className="mb-3 text-sm leading-relaxed text-zinc-500">{product.description}</p>

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-zinc-600">Material</dt>
              <dd className="text-zinc-300">{product.material}</dd>
            </div>
            <div>
              <dt className="mb-1 text-zinc-600">Quote</dt>
              <dd>
                <OrderActions product={product} variant="compact" />
              </dd>
            </div>
            {product.sourceName && (
              <div className="col-span-2">
                <dt className="text-zinc-600">Trend Source</dt>
                <dd>
                  <a
                    href={product.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600/90 hover:text-cyan-500"
                  >
                    {product.sourceName} ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
