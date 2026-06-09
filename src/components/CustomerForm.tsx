"use client";

import type { CustomerDetails } from "@/lib/whatsapp";

interface CustomerFormProps {
  customer: CustomerDetails;
  onChange: (customer: CustomerDetails) => void;
}

export default function CustomerForm({ customer, onChange }: CustomerFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-400">
          Your Name *
        </label>
        <input
          type="text"
          required
          value={customer.name}
          onChange={(e) => onChange({ ...customer, name: e.target.value })}
          placeholder="John Smith"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-400">
          Email *
        </label>
        <input
          type="email"
          required
          value={customer.email}
          onChange={(e) => onChange({ ...customer, email: e.target.value })}
          placeholder="you@email.com"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-zinc-400">
          Additional Notes (optional)
        </label>
        <textarea
          value={customer.notes || ""}
          onChange={(e) => onChange({ ...customer, notes: e.target.value })}
          placeholder="Special requests, quantity, deadline..."
          rows={2}
          className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>
    </div>
  );
}
