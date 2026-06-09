"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductForm, { emptyProduct } from "@/components/admin/ProductForm";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  exportProductsJson,
  getProducts,
  importProductsJson,
  loadSeedProducts,
  resetToSeed,
  saveProducts,
} from "@/lib/storage";
import type { Product } from "@/lib/types";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    loadSeedProducts().then(setProducts);
  }, []);

  function refresh() {
    setProducts(getProducts());
  }

  function handleSave() {
    if (!editing) return;
    const list = getProducts();
    const idx = list.findIndex((p) => p.id === editing.id);
    if (idx >= 0) list[idx] = editing;
    else list.unshift(editing);
    saveProducts(list);
    setEditing(null);
    setIsNew(false);
    refresh();
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const list = getProducts().filter((p) => p.id !== id);
    saveProducts(list);
    refresh();
  }

  function togglePublish(product: Product) {
    const list = getProducts().map((p) =>
      p.id === product.id ? { ...p, published: !p.published } : p
    );
    saveProducts(list);
    refresh();
  }

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Admin</h1>
            <p className="text-zinc-400">Manage your trending print catalog</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/scout"
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              🔍 Trend Scout
            </Link>
            <button
              onClick={() => {
                setEditing(emptyProduct());
                setIsNew(true);
              }}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
            >
              + Add Product
            </button>
            <button
              onClick={() => exportProductsJson(getProducts())}
              className="rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Export JSON
            </button>
            <label className="cursor-pointer rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
              Import JSON
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const data = await importProductsJson(file);
                  setProducts(data);
                }}
              />
            </label>
            <button
              onClick={() => {
                if (confirm("Reset to seed data?")) {
                  resetToSeed();
                  loadSeedProducts().then(setProducts);
                }
              }}
              className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              Reset
            </button>
          </div>
        </div>

        {editing && (
          <div className="mb-8">
            <ProductForm
              product={editing}
              onChange={setEditing}
              onSave={handleSave}
              onCancel={() => {
                setEditing(null);
                setIsNew(false);
              }}
              isNew={isNew}
            />
          </div>
        )}

        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{product.title}</h3>
                  {!product.published && (
                    <span className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500">
                  ${product.price} CAD · {product.category} · Score {product.trendScore}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePublish(product)}
                  className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  {product.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => {
                    setEditing({ ...product });
                    setIsNew(false);
                  }}
                  className="rounded-lg bg-zinc-700 px-3 py-1.5 text-xs text-white hover:bg-zinc-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200/80">
          💡 Products save to your browser (localStorage). Use <strong>Export JSON</strong> to
          backup, then upload to <code className="text-amber-300">public/data/products.json</code>{" "}
          and push to GitHub for live site updates.
        </p>
      </main>
    </>
  );
}
