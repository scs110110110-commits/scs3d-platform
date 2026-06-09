export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 sm:text-left">
        <p className="text-lg font-bold text-white">SCS3D</p>
        <p className="mt-1 text-sm text-zinc-500">
          Trending 3D Prints · Kitchener-Waterloo, ON · Local Pickup Available
        </p>
        <p className="mt-4 text-xs text-zinc-600">
          © {new Date().getFullYear()} scs3d.com — Order via WhatsApp
        </p>
      </div>
    </footer>
  );
}
