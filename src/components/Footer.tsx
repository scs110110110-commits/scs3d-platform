export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-lg font-bold text-white">SCS3D</p>
        <p className="mt-1 text-sm text-zinc-400">
          Kitchener-Waterloo 3D Design &amp; Printing Service
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Custom CAD design · Trending 3D prints · Local pickup in Kitchener-Waterloo, ON ·
          Shipping across Canada
        </p>
        <p className="mt-4 text-xs text-zinc-600">
          © {new Date().getFullYear()} scs3d.com — Kitchener-Waterloo 3D printing &amp; design
        </p>
      </div>
    </footer>
  );
}
