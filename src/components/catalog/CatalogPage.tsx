"use client";

import { useEffect, useMemo, useState } from "react";
import { getPublishedProducts, loadSeedProducts } from "@/lib/storage";
import type { Product } from "@/lib/types";
import CatalogFilters from "./CatalogFilters";
import CatalogHero from "./CatalogHero";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeedProducts().then((data) => {
      setProducts(getPublishedProducts(data));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, category, search]);

  const hotCount = products.filter((p) => p.status === "hot" || p.status === "trending").length;

  return (
    <>
      <CatalogHero productCount={products.length} hotCount={hotCount} />

      <div id="catalog" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <CatalogFilters
          activeCategory={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="py-20 text-center text-zinc-500">Loading catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">No products found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
