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
    <header className="sticky top-0 z-40 border-b border-zinc-800/40 bg-zinc-950/90 backdrop-blur-md">
      <div className="page-wrap flex items-center justify-between py-2.5 sm:py-3">
        <Link href="/" className="group shrink-0">
          <Logo size="md" />
        </Link>

        <nav className="flex items-center gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                pathname === item.href
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200"
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
