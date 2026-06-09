"use client";

import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-lg">
            🔒
          </div>
          <div>
            <div className="text-lg font-bold text-white">SCS3D Admin</div>
            <div className="text-xs text-zinc-500">Vercel protected</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-zinc-400 hover:text-cyan-400">
            Products
          </Link>
          <Link href="/admin/scout" className="text-sm text-zinc-400 hover:text-violet-400">
            Trend Scout
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-white"
          >
            View Site ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
