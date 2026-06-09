import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white">SCS3D</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
              Professional 3D printing and custom CAD design. Order via WhatsApp.
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-zinc-300">Navigate</p>
              <Link href="/" className="block text-zinc-500 hover:text-white">
                Trending
              </Link>
              <Link href="/custom" className="block text-zinc-500 hover:text-white">
                Custom Request
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-zinc-800/60 pt-6 text-xs text-zinc-600">
          © {new Date().getFullYear()} scs3d.com
        </p>
      </div>
    </footer>
  );
}
