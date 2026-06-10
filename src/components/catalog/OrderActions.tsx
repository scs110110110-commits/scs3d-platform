"use client";

import type { Product } from "@/lib/types";
import { openOrderEmail, openWhatsAppOrder } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface OrderActionsProps {
  product: Pick<Product, "title" | "material" | "category" | "shortDescription">;
  variant?: "card" | "compact";
}

export default function OrderActions({ product, variant = "card" }: OrderActionsProps) {
  if (variant === "compact") {
    const compactBtn =
      "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition";

    return (
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => openWhatsAppOrder(product)}
          className={`${compactBtn} bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800`}
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => openOrderEmail(product)}
          className={`${compactBtn} bg-zinc-800/80 text-cyan-600/90 hover:bg-zinc-800`}
        >
          Email
        </button>
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
    "inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[10px] font-semibold leading-tight transition";

  return (
    <div className="flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => openWhatsAppOrder(product)}
        className={`${compactBtn} bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800`}
      >
        <WhatsAppIcon className="h-3 w-3" />
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() => openOrderEmail(product)}
        className={`${compactBtn} bg-zinc-800/60 text-cyan-600/90 hover:bg-zinc-800`}
      >
        Email
      </button>
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
