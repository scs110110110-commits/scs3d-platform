import { BRAND_TAGLINE } from "@/lib/config";

interface CatalogHeroProps {
  productCount: number;
  hotCount: number;
}

export default function CatalogHero({ productCount, hotCount }: CatalogHeroProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Updated Daily · Kitchener-Waterloo
        </p>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
          Trending 3D Prints
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Order in One Tap
          </span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-zinc-400">{BRAND_TAGLINE}</p>

        <div className="flex flex-wrap gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-3">
            <div className="text-2xl font-bold text-white">{productCount}</div>
            <div className="text-xs text-zinc-500">Live Products</div>
          </div>
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3">
            <div className="text-2xl font-bold text-orange-400">{hotCount}</div>
            <div className="text-xs text-zinc-500">Hot Today</div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3">
            <div className="text-sm font-semibold text-emerald-400">💬 WhatsApp Order</div>
            <div className="text-xs text-zinc-500">Instant quote & pickup</div>
          </div>
        </div>
      </div>
    </section>
  );
}
