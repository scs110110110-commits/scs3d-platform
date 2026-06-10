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

  return (
    <>
      <CatalogHero />

      <div id="catalog" className="page-wrap pb-10 pt-4">
        <CatalogFilters
          activeCategory={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="py-10 text-center text-sm text-zinc-600">Loading catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-600">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
