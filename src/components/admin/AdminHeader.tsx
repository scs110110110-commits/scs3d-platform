"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo
          size="sm"
          title="SCS3D Admin"
          tagline="Session · 1h expiry"
          taglineClassName="text-xs text-zinc-500"
        />

        <nav className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-zinc-400 hover:text-cyan-400">
            Products
          </Link>
          <Link href="/admin/scout" className="text-sm text-zinc-400 hover:text-violet-400">
            Trend Scout
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-white"
          >
            View Site ↗
          </a>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
