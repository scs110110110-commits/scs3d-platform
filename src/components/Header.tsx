"use client";

import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/config";

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
          <span className="text-sm text-zinc-600">📍 Kitchener-Waterloo</span>
        </nav>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          💬 WhatsApp
        </a>
      </div>
    </header>
  );
}
