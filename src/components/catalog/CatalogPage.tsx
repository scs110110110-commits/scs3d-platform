"use client";

import { useEffect, useMemo, useState } from "react";
import type { CatalogSection } from "@/lib/config";
import { BRAND_TAGLINE, SOLUTIONS_TAGLINE } from "@/lib/config";
import { fetchCatalogProducts } from "@/lib/storage";
import type { Product } from "@/lib/types";
import CatalogFilters from "./CatalogFilters";
import CatalogHero from "./CatalogHero";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

const HERO_COPY: Record<CatalogSection, { label: string; description: string }> = {
  trending: {
    label: "Trending Catalog",
    description: BRAND_TAGLINE,
  },
  solutions: {
    label: "Custom Solutions",
    description: SOLUTIONS_TAGLINE,
  },
};

interface CatalogPageProps {
  section?: CatalogSection;
}

export default function CatalogPage({ section = "trending" }: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hero = HERO_COPY[section];

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchCatalogProducts(section)
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"))
      .finally(() => setLoading(false));
  }, [section]);

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

  const emptyMessage =
    section === "solutions"
      ? "No custom solutions yet — check back soon."
      : "No products found.";

  return (
    <>
      <CatalogHero label={hero.label} description={hero.description} />

      <div id="catalog" className="page-wrap pb-10 pt-4">
        <CatalogFilters
          activeCategory={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="py-10 text-center text-sm text-zinc-600">Loading catalog...</div>
        ) : error ? (
          <div className="py-10 text-center text-sm text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-600">{emptyMessage}</div>
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
