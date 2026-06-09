"use client";

import { TREND_BADGES } from "@/lib/config";
import type { Product } from "@/lib/types";
import { ORDER_BUTTON_LABEL, openWhatsAppOrder } from "@/lib/whatsapp";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  const badge = TREND_BADGES[product.status];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-64 w-full object-cover sm:h-80"
        />

        <div className="p-6">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              {product.category}
            </span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
              {badge.emoji} {badge.label} · Score {product.trendScore}
            </span>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white">{product.title}</h2>
          <p className="mb-4 text-zinc-400">{product.description}</p>

          <dl className="mb-6 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-zinc-500">Material</dt>
              <dd className="text-white">{product.material}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Quote</dt>
              <dd className="text-emerald-400">Request via WhatsApp</dd>
            </div>
            {product.sourceName && (
              <div className="col-span-2">
                <dt className="text-zinc-500">Trend Source</dt>
                <dd>
                  <a
                    href={product.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    {product.sourceName} ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <button
            onClick={() => openWhatsAppOrder(product)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-500"
          >
            💬 {ORDER_BUTTON_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
