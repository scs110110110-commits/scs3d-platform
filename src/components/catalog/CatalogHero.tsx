import Link from "next/link";
import { BRAND_TAGLINE } from "@/lib/config";

interface CatalogHeroProps {
  productCount: number;
  hotCount: number;
}

export default function CatalogHero({ productCount, hotCount }: CatalogHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/50">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live Trending Catalog
          </div>

          <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
            3D Design &amp;
            <br />
            <span className="gradient-text">Printing Studio</span>
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            {BRAND_TAGLINE}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/custom"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Submit Your Own Idea
            </Link>
            <a
              href="#catalog"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              Browse Trending Prints
            </a>
          </div>
        </div>

        <div className="mt-14 grid max-w-lg grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="text-2xl font-bold text-white">{productCount}</div>
            <div className="mt-1 text-xs text-zinc-500">Products</div>
          </div>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
            <div className="text-2xl font-bold text-orange-400">{hotCount}</div>
            <div className="mt-1 text-xs text-zinc-500">Hot Today</div>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="text-2xl font-bold text-cyan-400">24h</div>
            <div className="mt-1 text-xs text-zinc-500">Fresh Picks</div>
          </div>
        </div>
      </div>
    </section>
  );
}
