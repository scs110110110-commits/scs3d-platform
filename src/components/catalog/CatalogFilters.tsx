"use client";

import { CATEGORIES } from "@/lib/config";

interface CatalogFiltersProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  search: string;
  onSearchChange: (q: string) => void;
}

export default function CatalogFilters({
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
}: CatalogFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <input
        type="search"
        placeholder="Search trending prints..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-cyan-500"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === "all"
              ? "bg-cyan-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-cyan-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
