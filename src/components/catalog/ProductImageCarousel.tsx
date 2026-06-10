"use client";

import { useState } from "react";
import { getProductImages } from "@/lib/productImages";
import type { Product } from "@/lib/types";

interface ProductImageCarouselProps {
  product: Pick<Product, "title" | "imageUrl" | "images">;
  onImageClick?: () => void;
  variant?: "card" | "modal";
}

export default function ProductImageCarousel({
  product,
  onImageClick,
  variant = "card",
}: ProductImageCarouselProps) {
  const images = getProductImages(product);
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const current = images[index] ?? product.imageUrl;

  function goPrev(e: React.MouseEvent) {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function goNext(e: React.MouseEvent) {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  }

  if (variant === "modal") {
    return (
      <div className="bg-zinc-950">
        <div className="relative aspect-[5/3] overflow-hidden bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={`${product.title} — photo ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        {hasMultiple && (
          <div className="flex gap-2 overflow-x-auto border-t border-zinc-800 px-4 py-3">
            {images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                aria-label={`View photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === index
                    ? "border-cyan-500 ring-2 ring-cyan-500/30"
                    : "border-zinc-700 opacity-70 hover:border-zinc-500 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const arrowClass =
    "absolute top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-80 backdrop-blur-sm transition hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100";

  return (
    <div
      className={`group relative aspect-square overflow-hidden bg-zinc-800 ${onImageClick ? "cursor-pointer" : ""}`}
      onClick={onImageClick}
      role={onImageClick ? "button" : undefined}
      tabIndex={onImageClick ? 0 : undefined}
      onKeyDown={
        onImageClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onImageClick();
              }
            }
          : undefined
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={`${product.title} — photo ${index + 1}`}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={goPrev}
            className={`${arrowClass} left-1.5`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={goNext}
            className={`${arrowClass} right-1.5`}
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === index ? "w-3 bg-white" : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
