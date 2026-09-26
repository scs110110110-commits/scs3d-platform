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
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="search"
        placeholder="Search prints…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none transition focus:border-[var(--accent)] sm:max-w-[16rem]"
      />
      <label className="relative w-full sm:w-auto">
        <span className="sr-only">Category</span>
        <select
          value={activeCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] py-2.5 pl-3.5 pr-9 text-sm font-medium text-[var(--foreground)] outline-none focus:border-[var(--accent)] sm:w-auto"
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
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-2)]"
        >
          ▾
        </span>
      </label>
    </div>
  );
}
