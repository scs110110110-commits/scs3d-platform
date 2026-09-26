import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="page-wrap flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight text-[var(--foreground)]">SCS3D</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} scs3d.com · Kitchener–Waterloo
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-[var(--muted)] transition hover:text-[var(--foreground)]">
            Trending
          </Link>
          <Link
            href="/solutions"
            className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Solutions
          </Link>
          <Link
            href="/custom"
            className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Custom
          </Link>
        </div>
      </div>
    </footer>
  );
}
