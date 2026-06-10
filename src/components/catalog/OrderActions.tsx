"use client";

import type { Product } from "@/lib/types";
import { getOrderEmailHref, openWhatsAppOrder } from "@/lib/whatsapp";

interface OrderActionsProps {
  product: Pick<Product, "title" | "material" | "category" | "shortDescription">;
  variant?: "card" | "compact";
}

export default function OrderActions({ product, variant = "card" }: OrderActionsProps) {
  if (variant === "compact") {
    const compactBtn =
      "inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold transition";

    return (
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => openWhatsAppOrder(product)}
          className={`${compactBtn} bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30`}
        >
          WhatsApp
        </button>
        <a
          href={getOrderEmailHref(product)}
          className={`${compactBtn} bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30`}
        >
          Email
        </a>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Coming soon"
          className={`${compactBtn} cursor-not-allowed border border-zinc-700 bg-zinc-800/60 text-zinc-500`}
        >
          Online <span className="font-normal opacity-70">(Coming Soon)</span>
        </button>
      </div>
    );
  }

  const compactBtn =
    "inline-flex flex-1 items-center justify-center rounded-lg px-1.5 py-1.5 text-[10px] font-semibold leading-tight transition";

  return (
    <div className="flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => openWhatsAppOrder(product)}
        className={`${compactBtn} bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30`}
      >
        WhatsApp
      </button>
      <a
        href={getOrderEmailHref(product)}
        className={`${compactBtn} bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30`}
      >
        Email
      </a>
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="Coming soon"
        className={`${compactBtn} cursor-not-allowed border border-zinc-700 bg-zinc-800/60 text-zinc-500`}
      >
        Online <span className="font-normal opacity-70">(Soon)</span>
      </button>
    </div>
  );
}
