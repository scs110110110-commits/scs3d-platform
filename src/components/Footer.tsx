import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/40 bg-zinc-950">
      <div className="page-wrap py-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Logo size="md" />
          </div>
          <div className="flex gap-4 text-xs">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300">
              Trending
            </Link>
            <Link href="/custom" className="text-zinc-500 hover:text-zinc-300">
              Custom Request
            </Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-zinc-700">
          © {new Date().getFullYear()} scs3d.com
        </p>
      </div>
    </footer>
  );
}
