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
    label: "Trending prints",
    description: BRAND_TAGLINE,
  },
  solutions: {
    label: "Custom solutions",
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
      ? "No custom solutions published yet — check back soon."
      : "No products match this filter.";

  return (
    <>
      <CatalogHero label={hero.label} description={hero.description} />

      <div id="catalog" className="page-wrap pb-14 pt-6 sm:pt-8">
        <CatalogFilters
          activeCategory={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-[var(--surface-2)]"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-14 text-center">
            <p className="text-base font-medium text-[var(--foreground)]">{emptyMessage}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Try another category, or{" "}
              <a href="/custom" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
                request a custom build
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                className="animate-[fadeUp_420ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
              >
                <ProductCard product={product} onSelect={setSelected} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
