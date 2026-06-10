"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const NAV = [
  { href: "/", label: "Trending" },
  { href: "/custom", label: "Custom Request" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 glass-panel">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="group">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
