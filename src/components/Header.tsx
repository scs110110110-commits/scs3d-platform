"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-lg font-bold text-white">
            S
          </div>
          <div>
            <div className="text-lg font-bold text-white">SCS3D</div>
            <div className="text-xs text-zinc-500">Trending Prints</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm text-zinc-400 transition hover:text-white">
            Catalog
          </Link>
          <Link href="/admin/scout" className="text-sm text-zinc-400 transition hover:text-violet-400">
            Trend Scout
          </Link>
          <Link href="/admin" className="text-sm text-zinc-400 transition hover:text-cyan-400">
            Admin
          </Link>
        </nav>

        <Link
          href="/admin/scout"
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          + Scout
        </Link>
      </div>
    </header>
  );
}
