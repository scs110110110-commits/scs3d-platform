"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Logo from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <div className="mb-6 flex justify-center">
          <Logo
            size="lg"
            title="SCS3D Admin"
            tagline="Session expires after 1 hour"
            taglineClassName="text-sm text-zinc-500"
          />
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          autoFocus
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-cyan-500"
        />

        {error && (
          <p className="mb-4 text-center text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-4 text-center text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">
            ← Back to site
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-zinc-500">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
