import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/30 bg-zinc-950/75 backdrop-blur-sm">
      <div className="page-wrap flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} scs3d.com
        </p>
        <div className="flex gap-4 text-xs">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300">
            Trending
          </Link>
          <Link href="/custom" className="text-zinc-500 hover:text-zinc-300">
            Custom Request
          </Link>
        </div>
      </div>
    </footer>
  );
}
