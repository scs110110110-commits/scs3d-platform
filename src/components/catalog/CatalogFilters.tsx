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
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <input
        type="search"
        placeholder="Search prints..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600 sm:max-w-[12rem] sm:flex-none"
      />
      <label className="relative shrink-0">
        <span className="sr-only">Category</span>
        <select
          value={activeCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none rounded-md border border-zinc-800 bg-zinc-900/60 py-1.5 pl-2.5 pr-7 text-xs font-medium text-zinc-200 outline-none focus:border-zinc-600"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500"
        >
          ▾
        </span>
      </label>
    </div>
  );
}
