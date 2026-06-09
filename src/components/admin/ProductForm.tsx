"use client";

import { CATEGORIES, type Category, type TrendStatus } from "@/lib/config";
import type { Product } from "@/lib/types";
import { generateId } from "@/lib/storage";

export const emptyProduct = (): Product => ({
  id: generateId(),
  title: "",
  shortDescription: "",
  description: "",
  price: 20,
  imageUrl: "",
  images: [],
  category: "Desk & Office",
  tags: [],
  trendScore: 70,
  status: "rising",
  material: "PLA",
  published: true,
  featured: false,
  socialProof: 100,
  createdAt: new Date().toISOString(),
});

interface ProductFormProps {
  product: Product;
  onChange: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}

export default function ProductForm({
  product,
  onChange,
  onSave,
  onCancel,
  isNew,
}: ProductFormProps) {
  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    onChange({ ...product, [key]: value });

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-6">
      <h3 className="mb-4 text-lg font-bold text-white">
        {isNew ? "New Product" : "Edit Product"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">Title *</label>
          <input
            value={product.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">Short Description</label>
          <input
            value={product.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">Full Description</label>
          <textarea
            value={product.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Price (CAD)</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Material</label>
          <input
            value={product.material}
            onChange={(e) => set("material", e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">Image URL *</label>
          <input
            value={product.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
          {product.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt="Preview"
              className="mt-2 h-24 w-24 rounded-lg object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Category</label>
          <select
            value={product.category}
            onChange={(e) => set("category", e.target.value as Category)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Trend Status</label>
          <select
            value={product.status}
            onChange={(e) => set("status", e.target.value as TrendStatus)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          >
            <option value="hot">Hot Today</option>
            <option value="trending">Trending</option>
            <option value="rising">Rising</option>
            <option value="stable">Popular</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">
            Trend Score ({product.trendScore})
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={product.trendScore}
            onChange={(e) => set("trendScore", Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Social Proof (views)</label>
          <input
            type="number"
            value={product.socialProof}
            onChange={(e) => set("socialProof", Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">Tags (comma separated)</label>
          <input
            value={product.tags.join(", ")}
            onChange={(e) =>
              set(
                "tags",
                e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
              )
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Source Name</label>
          <input
            value={product.sourceName || ""}
            onChange={(e) => set("sourceName", e.target.value)}
            placeholder="Etsy, Printables..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Source URL</label>
          <input
            value={product.sourceUrl || ""}
            onChange={(e) => set("sourceUrl", e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={product.published}
            onChange={(e) => set("published", e.target.checked)}
            className="rounded"
          />
          Published (visible on catalog)
        </label>

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={product.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="rounded"
          />
          Featured
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onSave}
          className="rounded-xl bg-cyan-600 px-6 py-2.5 font-semibold text-white hover:bg-cyan-500"
        >
          Save Product
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-zinc-600 px-6 py-2.5 text-zinc-300 hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
