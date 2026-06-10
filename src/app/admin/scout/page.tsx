"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { CATEGORIES, type Category } from "@/lib/config";
import { DAILY_SCOUT_GOAL, SCOUT_SOURCES } from "@/lib/scoutSources";
import {
  generateId,
  getProducts,
  getScoutQueue,
  loadSeedProducts,
  saveProducts,
  saveScoutQueue,
} from "@/lib/storage";
import type { Product, ScoutItem } from "@/lib/types";

const today = () => new Date().toISOString().slice(0, 10);

interface ScoutCronStatus {
  telegramConfigured: boolean;
  snapshotConfigured: boolean;
  cronSecretConfigured: boolean;
  cronSchedule: string;
  cronPath: string;
  snapshot: {
    date: string;
    fetchedAt: string;
    items: { title: string; rank: number; trendScore: number }[];
  } | null;
}

export default function ScoutPage() {
  const [queue, setQueue] = useState<ScoutItem[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [cronStatus, setCronStatus] = useState<ScoutCronStatus | null>(null);
  const [form, setForm] = useState({
    title: "",
    sourceUrl: "",
    sourceName: "",
    imageUrl: "",
    notes: "",
    trendScore: 75,
    category: "Desk & Office" as Category,
  });

  useEffect(() => {
    const items = getScoutQueue();
    setQueue(items);
    setTodayCount(items.filter((i) => i.scoutedAt.startsWith(today())).length);

    fetch("/api/scout/status", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setCronStatus(data))
      .catch(() => {});
  }, []);

  function addToQueue() {
    if (!form.title.trim() || !form.imageUrl.trim()) return;

    const item: ScoutItem = {
      id: generateId(),
      title: form.title,
      sourceUrl: form.sourceUrl,
      sourceName: form.sourceName || "Manual",
      imageUrl: form.imageUrl,
      notes: form.notes,
      trendScore: form.trendScore,
      category: form.category,
      scoutedAt: new Date().toISOString(),
      promoted: false,
    };

    const updated = [item, ...getScoutQueue()];
    saveScoutQueue(updated);
    setQueue(updated);
    setTodayCount(updated.filter((i) => i.scoutedAt.startsWith(today())).length);
    setForm({
      title: "",
      sourceUrl: "",
      sourceName: "",
      imageUrl: "",
      notes: "",
      trendScore: 75,
      category: "Desk & Office",
    });
  }

  function promoteToCatalog(item: ScoutItem) {
    loadSeedProducts().then(() => {
      const product: Product = {
        id: generateId(),
        title: item.title,
        shortDescription: item.notes.slice(0, 120) || item.title,
        description: item.notes || item.title,
        price: 20,
        imageUrl: item.imageUrl,
        images: [],
        category: item.category,
        tags: [],
        trendScore: item.trendScore,
        status: item.trendScore >= 90 ? "hot" : item.trendScore >= 80 ? "trending" : "rising",
        sourceUrl: item.sourceUrl,
        sourceName: item.sourceName,
        material: "PLA",
        published: true,
        featured: item.trendScore >= 85,
        socialProof: Math.floor(item.trendScore * 5),
        createdAt: new Date().toISOString(),
      };

      const products = [product, ...getProducts()];
      saveProducts(products);

      const updated = getScoutQueue().map((q) =>
        q.id === item.id ? { ...q, promoted: true } : q
      );
      saveScoutQueue(updated);
      setQueue(updated);
    });
  }

  async function autoFetchTrending() {
    setFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/scout/trending?limit=10", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");

      const existing = getScoutQueue();
      const newItems: ScoutItem[] = data.items.map(
        (item: {
          title: string;
          sourceUrl: string;
          sourceName: string;
          imageUrl: string;
          notes: string;
          trendScore: number;
          category: Category;
        }) => ({
          id: generateId(),
          title: item.title,
          sourceUrl: item.sourceUrl,
          sourceName: item.sourceName,
          imageUrl: item.imageUrl,
          notes: item.notes,
          trendScore: item.trendScore,
          category: item.category,
          scoutedAt: new Date().toISOString(),
          promoted: false,
        })
      );

      const merged = [...newItems, ...existing].slice(0, 50);
      saveScoutQueue(merged);
      setQueue(merged);
      setTodayCount(merged.filter((i) => i.scoutedAt.startsWith(today())).length);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Auto-fetch failed");
    } finally {
      setFetching(false);
    }
  }

  const progress = Math.min((todayCount / DAILY_SCOUT_GOAL) * 100, 100);

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-zinc-500 hover:text-cyan-400">
            ← Back to Admin
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">Trend Scout</h1>
          <p className="text-zinc-400">
            Research rising 3D prints from top platforms — goal: {DAILY_SCOUT_GOAL}/day
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-white">Today&apos;s Progress</span>
            <span className="text-violet-400">
              {todayCount} / {DAILY_SCOUT_GOAL}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {todayCount >= DAILY_SCOUT_GOAL && (
            <p className="mt-2 text-sm text-emerald-400">🎉 Daily goal reached!</p>
          )}
        </div>

        <section className="mb-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <h2 className="text-xl font-bold text-white">Daily Telegram Report (Vercel Cron)</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Every morning: fetch Reddit + Printables, compare with yesterday, send top 5 rising
            links to Telegram. You add photos manually here.
          </p>
          {cronStatus ? (
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <StatusPill
                ok={cronStatus.cronSecretConfigured}
                label="CRON_SECRET"
              />
              <StatusPill
                ok={cronStatus.telegramConfigured}
                label="Telegram bot"
              />
              <StatusPill
                ok={cronStatus.snapshotConfigured}
                label="Vercel KV / Upstash snapshot"
              />
              <p className="text-zinc-500 sm:col-span-2">
                Schedule: {cronStatus.cronSchedule} · Path:{" "}
                <code className="text-emerald-400">{cronStatus.cronPath}</code>
              </p>
              {cronStatus.snapshot ? (
                <p className="text-zinc-500 sm:col-span-2">
                  Last snapshot: {cronStatus.snapshot.date} (
                  {cronStatus.snapshot.items.length} items) — rising deltas use this baseline.
                </p>
              ) : (
                <p className="text-amber-400/90 sm:col-span-2">
                  No snapshot yet. First cron run sends today&apos;s top picks; rising comparison
                  starts on the second day.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">Loading cron status...</p>
          )}
        </section>

        <section className="mb-10 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Auto-Fetch Rising Products</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Pulls trending items from Reddit r/3Dprinting and Printables automatically.
              </p>
            </div>
            <button
              onClick={autoFetchTrending}
              disabled={fetching}
              className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {fetching ? "Fetching..." : "⚡ Fetch 10 Rising Products"}
            </button>
          </div>
          {fetchError && (
            <p className="mt-3 text-sm text-red-400">{fetchError}</p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-white">Research Sources</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCOUT_SOURCES.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-violet-500/50 hover:bg-zinc-900"
              >
                <div className="mb-2 text-2xl">{source.icon}</div>
                <h3 className="font-semibold text-white">{source.name}</h3>
                <p className="mb-2 text-sm text-zinc-500">{source.description}</p>
                <span className="text-xs text-violet-400">{source.checkFrequency} ↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-white">Quick Capture</h2>
          <p className="mb-4 text-sm text-zinc-500">
            Browse sources above, then paste product details here. One-click promote to catalog.
          </p>

          <div className="grid gap-4 rounded-2xl border border-zinc-700 bg-zinc-900/60 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-zinc-400">Product Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Articulating Crystal Dragon"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Source URL</label>
              <input
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Source Name</label>
              <input
                value={form.sourceName}
                onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                placeholder="Etsy, Printables..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-violet-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-zinc-400">Image URL *</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="Right-click image → Copy image address"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-violet-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-zinc-400">Notes / Why is it trending?</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Category })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white outline-none focus:border-violet-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                Trend Score ({form.trendScore})
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={form.trendScore}
                onChange={(e) =>
                  setForm({ ...form, trendScore: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                onClick={addToQueue}
                disabled={!form.title.trim() || !form.imageUrl.trim()}
                className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-40"
              >
                + Add to Scout Queue
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Scout Queue</h2>
          {queue.length === 0 ? (
            <p className="text-zinc-500">No scouted items yet. Start researching!</p>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-wrap items-center gap-4 rounded-xl border p-4 ${
                    item.promoted
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-zinc-500">
                      {item.sourceName} · Score {item.trendScore} ·{" "}
                      {new Date(item.scoutedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {item.promoted ? (
                    <span className="text-sm text-emerald-400">✓ In Catalog</span>
                  ) : (
                    <button
                      onClick={() => promoteToCatalog(item)}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      → Publish to Catalog
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        ok
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-amber-500/15 text-amber-300"
      }`}
    >
      {ok ? "✓" : "○"} {label}
    </span>
  );
}
