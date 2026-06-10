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
    <header className="sticky top-0 z-40 border-b border-zinc-800/40 bg-zinc-950/95 backdrop-blur-md">
      <div className="page-wrap py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="group shrink-0 self-start">
            <Logo size="xl" />
          </Link>

          <nav className="flex items-center gap-1 sm:gap-1.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
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
      </div>
    </header>
  );
}
