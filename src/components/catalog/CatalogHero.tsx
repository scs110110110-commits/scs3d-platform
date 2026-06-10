import { BRAND_TAGLINE } from "@/lib/config";

export default function CatalogHero() {
  return (
    <section className="border-b border-zinc-800/30 bg-black/40 backdrop-blur-[2px]">
      <div className="page-wrap py-4 sm:py-5">
        <h1 className="sr-only">SCS3D — 3D Design &amp; Printing Studio</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="select-none text-xs font-semibold uppercase tracking-widest text-emerald-500/80">
            Trending Catalog
          </p>
          <p className="max-w-lg text-sm leading-relaxed text-zinc-500 sm:text-right">
            {BRAND_TAGLINE}
          </p>
        </div>
      </div>
    </section>
  );
}
