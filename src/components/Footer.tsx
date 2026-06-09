export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="text-lg font-bold text-white">SCS3D</p>
        <p className="mt-1 text-sm text-zinc-500">
          Professional 3D Printing &amp; CAD Design · Kitchener-Waterloo, ON
        </p>
        <p className="mt-4 text-xs text-zinc-600">
          © {new Date().getFullYear()} scs3d.com — All pricing calculated client-side
        </p>
      </div>
    </footer>
  );
}
