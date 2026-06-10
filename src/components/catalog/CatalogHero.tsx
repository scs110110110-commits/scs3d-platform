import { BRAND_TAGLINE } from "@/lib/config";

export default function CatalogHero() {
  return (
    <section className="border-b border-zinc-800/40 bg-zinc-950/50">
      <div className="page-wrap py-5 sm:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 select-none text-[10px] font-semibold uppercase tracking-widest text-emerald-500/80">
              Trending Catalog
            </p>
            <h1 className="select-none text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
              3D Design &amp;{" "}
              <span className="gradient-text">Printing Studio</span>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-snug text-zinc-500 sm:text-right">
            {BRAND_TAGLINE}
          </p>
        </div>
      </div>
    </section>
  );
}
