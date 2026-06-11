"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getPageLabel, type AnalyticsSnapshot } from "@/lib/analyticsStore";
import { parseApiJson } from "@/lib/apiClient";

function formatDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  return d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/analytics", {
        credentials: "include",
        cache: "no-store",
      });
      const payload = await parseApiJson<{ analytics?: AnalyticsSnapshot; error?: string }>(res);
      if (!res.ok) throw new Error(payload.error || "Failed to load analytics");
      setData(payload.analytics ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pages = data
    ? [...new Set([...Object.keys(data.total), ...Object.keys(data.today)])].sort()
    : [];

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Site Analytics</h1>
            <p className="text-zinc-400">Public page views — Trending, Custom Solutions, Custom Request</p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              refresh();
            }}
            className="rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-zinc-500">Loading analytics...</p>
        ) : !data?.configured ? (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Analytics storage not configured — link Upstash Redis in Vercel.
          </p>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-sm text-zinc-500">Total page views</p>
                <p className="mt-1 text-3xl font-bold text-white">{data.totalViews}</p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <p className="text-sm text-cyan-300/70">Today</p>
                <p className="mt-1 text-3xl font-bold text-cyan-200">{data.todayViews}</p>
              </div>
            </div>

            <div className="mb-8 overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Page</th>
                    <th className="px-4 py-3 font-medium">Today</th>
                    <th className="px-4 py-3 font-medium">All time</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-zinc-500">
                        No views recorded yet. Visit the public site to start collecting data.
                      </td>
                    </tr>
                  ) : (
                    pages.map((path) => (
                      <tr key={path} className="border-b border-zinc-800/80">
                        <td className="px-4 py-3 text-white">
                          <div>{getPageLabel(path)}</div>
                          <div className="text-xs text-zinc-500">{path}</div>
                        </td>
                        <td className="px-4 py-3 text-cyan-300">{data.today[path] ?? 0}</td>
                        <td className="px-4 py-3 text-zinc-200">{data.total[path] ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h2 className="mb-4 text-lg font-semibold text-white">Last 7 days</h2>
              <div className="space-y-3">
                {data.days.map((date) => {
                  const dayTotal = Object.values(data.daily[date] ?? {}).reduce(
                    (sum, n) => sum + n,
                    0
                  );
                  return (
                    <div
                      key={date}
                      className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-zinc-300">{formatDate(date)}</span>
                      <span className="font-medium text-white">{dayTotal} views</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-6 text-xs text-zinc-600">
              Counts unique page opens per browser session (30s dedupe). Admin visits are not tracked.
            </p>
          </>
        )}
      </main>
    </>
  );
}
