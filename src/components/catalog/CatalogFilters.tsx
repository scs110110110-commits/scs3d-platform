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
    <div className="mb-4 space-y-2.5">
      <input
        type="search"
        placeholder="Search prints..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600"
      />
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            activeCategory === "all"
              ? "bg-zinc-700 text-zinc-100"
              : "bg-zinc-900/60 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              activeCategory === cat
                ? "bg-zinc-700 text-zinc-100"
                : "bg-zinc-900/60 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
