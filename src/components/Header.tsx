"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-lg font-bold text-white">
            S
          </div>
          <div>
            <div className="text-lg font-bold text-white">SCS3D</div>
            <div className="text-xs text-zinc-500">scs3d.com</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 sm:flex">
          <a
            href="#instant-quote"
            className="text-sm text-zinc-400 transition hover:text-cyan-400"
          >
            3D Print Quote
          </a>
          <a
            href="#photo-to-print"
            className="text-sm text-zinc-400 transition hover:text-violet-400"
          >
            CAD Design
          </a>
        </nav>

        <a
          href="#instant-quote"
          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
        >
          Get Quote
        </a>
      </div>
    </header>
  );
}
