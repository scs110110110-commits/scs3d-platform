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
    <header className="sticky top-0 z-40 border-b border-zinc-800/40 bg-black/90 backdrop-blur-md">
      <div className="page-wrap flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="hidden text-[10px] text-zinc-600 sm:inline">Admin · 1h session</span>
        </div>

        <nav className="flex items-center gap-3">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Products
          </Link>
          <Link href="/admin/scout" className="text-xs text-zinc-500 hover:text-violet-400">
            Scout
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-zinc-300"
          >
            Site ↗
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-zinc-800 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-900"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
