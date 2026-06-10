"use client";

import { useState } from "react";
import { compressImageFile } from "@/lib/imageCompress";
import {
  galleryToProductFields,
  getProductImages,
  MAX_PRODUCT_IMAGE_BYTES,
  MAX_PRODUCT_IMAGES,
} from "@/lib/productImages";
import type { Product } from "@/lib/types";

interface ProductImageManagerProps {
  product: Pick<Product, "imageUrl" | "images">;
  onChange: (fields: Pick<Product, "imageUrl" | "images">) => void;
}

async function readImageFiles(files: FileList): Promise<string[]> {
  const results: string[] = [];

  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) continue;
    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      throw new Error(`"${file.name}" is too large. Max 2MB per image.`);
    }

    const dataUrl = await compressImageFile(file);
    results.push(dataUrl);
  }

  return results;
}

export default function ProductImageManager({ product, onChange }: ProductImageManagerProps) {
  const gallery = getProductImages(product);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateGallery(next: string[]) {
    onChange(galleryToProductFields(next.slice(0, MAX_PRODUCT_IMAGES)));
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setLoading(true);
    try {
      const uploaded = await readImageFiles(files);
      if (!uploaded.length) {
        setError("No valid image files selected.");
        return;
      }
      const combined = [...gallery, ...uploaded].slice(0, MAX_PRODUCT_IMAGES);
      if (gallery.length + uploaded.length > MAX_PRODUCT_IMAGES) {
        setError(`Only the first ${MAX_PRODUCT_IMAGES} images were added.`);
      }
      updateGallery(combined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (gallery.includes(url)) {
      setError("This image is already in the gallery.");
      return;
    }
    if (gallery.length >= MAX_PRODUCT_IMAGES) {
      setError(`Maximum ${MAX_PRODUCT_IMAGES} images per product.`);
      return;
    }
    setError("");
    updateGallery([...gallery, url]);
    setUrlInput("");
  }

  function removeAt(index: number) {
    updateGallery(gallery.filter((_, i) => i !== index));
  }

  function setAsMain(index: number) {
    if (index === 0) return;
    const next = [...gallery];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    updateGallery(next);
  }

  return (
    <div className="sm:col-span-2">
      <label className="mb-1 block text-sm text-zinc-400">
        Product Photos * <span className="text-zinc-600">(up to {MAX_PRODUCT_IMAGES})</span>
      </label>

      <label className="mb-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/40 px-4 py-8 transition hover:border-cyan-500/50 hover:bg-zinc-800/60">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={loading || gallery.length >= MAX_PRODUCT_IMAGES}
          onChange={(e) => {
            handleFileUpload(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="text-2xl">📷</div>
        <p className="mt-2 text-sm font-medium text-white">
          {loading ? "Uploading..." : "Upload photos from computer"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          JPG, PNG, WebP — max 2MB each (auto-compressed for save)
        </p>
      </label>

      <div className="mb-3 flex gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste image URL..."
          className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
        />
        <button
          type="button"
          onClick={addUrl}
          className="shrink-0 rounded-xl border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Add URL
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.map((url, index) => (
            <div
              key={`${url.slice(0, 32)}-${index}`}
              className={`relative overflow-hidden rounded-xl border-2 ${
                index === 0 ? "border-cyan-500" : "border-zinc-700"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-cyan-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Main
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/70 p-1.5">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsMain(index)}
                    className="flex-1 rounded bg-zinc-800 px-1 py-1 text-[10px] text-zinc-200 hover:bg-zinc-700"
                  >
                    Set main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="rounded bg-red-500/20 px-2 py-1 text-[10px] text-red-300 hover:bg-red-500/30"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Add at least one photo for the catalog.</p>
      )}
    </div>
  );
}
