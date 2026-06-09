import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-white">SCS3D</p>
            <p className="text-sm text-zinc-500">
              Trending 3D Prints · Kitchener-Waterloo, ON
            </p>
          </div>
          <div className="flex gap-4 text-sm text-zinc-500">
            <Link href="/admin" className="hover:text-cyan-400">
              Admin
            </Link>
            <Link href="/admin/scout" className="hover:text-violet-400">
              Trend Scout
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-600 sm:text-left">
          © {new Date().getFullYear()} scs3d.com — Order via WhatsApp
        </p>
      </div>
    </footer>
  );
}
