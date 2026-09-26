import Link from "next/link";

interface CatalogHeroProps {
  label: string;
  description: string;
  brandFirst?: boolean;
}

export default function CatalogHero({
  label,
  description,
  brandFirst = true,
}: CatalogHeroProps) {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="page-wrap grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-12 lg:py-16">
        <div className="min-w-0">
          {brandFirst && (
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Kitchener–Waterloo · 3D studio
            </p>
          )}
          <p className="mb-2 text-sm font-semibold tracking-tight text-[var(--muted)]">{label}</p>
          <h1 className="text-balance text-[clamp(2.75rem,6vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[var(--foreground)]">
            SCS3D
          </h1>
          <p className="mt-4 max-w-[38rem] text-base leading-relaxed text-[var(--muted)] sm:text-[1.05rem]">
            {description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/custom" className="btn-primary w-full sm:w-auto">
              Start a custom print
            </Link>
          </div>
        </div>

        <aside className="relative hidden min-h-[11rem] overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] lg:block">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-2xl"
          />
          <p className="relative text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-2)]">
            Made to order
          </p>
          <p className="relative mt-3 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Print · CAD · Personalize
          </p>
          <p className="relative mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            Local studio builds — from fidget toys to photo lithophanes and named desk pieces.
          </p>
        </aside>
      </div>
    </section>
  );
}
