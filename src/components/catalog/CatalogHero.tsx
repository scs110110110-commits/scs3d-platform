import { BRAND_TAGLINE } from "@/lib/config";

export default function CatalogHero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/50">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
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

          <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
            {BRAND_TAGLINE}
          </p>
        </div>
      </div>
    </section>
  );
}
