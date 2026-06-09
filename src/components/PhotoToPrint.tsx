"use client";

import { useMemo, useState } from "react";
import { estimateCadDesign, type Unit } from "@/lib/cadEstimator";
import {
  buildCadReceipt,
  copyToClipboard,
  getWhatsAppUrl,
  type CustomerDetails,
} from "@/lib/whatsapp";
import CustomerForm from "./CustomerForm";
import FileDropzone from "./FileDropzone";
import LocationBadges from "./LocationBadges";
import WhatsAppModal from "./WhatsAppModal";

export default function PhotoToPrint() {
  const [images, setImages] = useState<File[]>([]);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<Unit>("cm");
  const [purpose, setPurpose] = useState("");
  const [mechanicalStress, setMechanicalStress] = useState(false);
  const [customer, setCustomer] = useState<CustomerDetails>({ name: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const estimate = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!l || !w || !h || !purpose.trim()) return null;

    return estimateCadDesign({
      length: l,
      width: w,
      height: h,
      unit,
      purpose,
      mechanicalStress,
      imageCount: images.length,
    });
  }, [length, width, height, unit, purpose, mechanicalStress, images.length]);

  const dimensionsLabel = useMemo(() => {
    if (!length || !width || !height) return "";
    return `${length} × ${width} × ${height} ${unit}`;
  }, [length, width, height, unit]);

  async function handleWhatsAppOrder() {
    if (!estimate) {
      setError("Lütfen tüm boyutları ve amaç alanını doldurun.");
      return;
    }
    if (!customer.name.trim() || !customer.email.trim()) {
      setError("Lütfen ad ve e-posta bilgilerinizi girin.");
      return;
    }
    if (images.length === 0) {
      setError("Lütfen en az bir referans görseli yükleyin.");
      return;
    }

    const receipt = buildCadReceipt({
      estimate,
      dimensions: dimensionsLabel,
      purpose,
      mechanicalStress,
      imageCount: images.length,
      customer,
    });

    await copyToClipboard(receipt);
    setShowModal(true);

    setTimeout(() => {
      window.open(getWhatsAppUrl(receipt), "_blank");
    }, 800);
  }

  return (
    <section id="photo-to-print" className="scroll-mt-24">
      <div className="mb-8">
        <span className="mb-3 inline-block rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-400">
          Flow 2
        </span>
        <h2 className="mb-2 text-3xl font-bold text-white">
          Photo-to-Print CAD Design
        </h2>
        <p className="text-zinc-400">
          Upload reference photos and describe your part. Get an AI-assisted design time and price estimate.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <FileDropzone
            accept=".jpg,.jpeg,.png,.webp"
            label="Upload reference images"
            hint="JPG, PNG — drag multiple photos"
            icon="📸"
            onFile={(f) => setImages((prev) => [...prev, f])}
            multiple
            onFiles={(files) => setImages((prev) => [...prev, ...files])}
          />

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div
                  key={`${img.name}-${i}`}
                  className="group relative overflow-hidden rounded-lg border border-zinc-700"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    className="h-20 w-20 object-cover"
                  />
                  <button
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-700/80 bg-zinc-800/40 p-5">
            <h3 className="mb-4 font-semibold text-white">Design Brief</h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-zinc-400">Unit</label>
              <div className="flex gap-2">
                {(["cm", "inch"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      unit === u
                        ? "bg-violet-600 text-white"
                        : "bg-zinc-700/60 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-3">
              {[
                { label: "Length", value: length, set: setLength },
                { label: "Width", value: width, set: setWidth },
                { label: "Height", value: height, set: setHeight },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    {field.label} ({unit})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-zinc-400">
                What will this part be used for?
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe the function, mounting points, environment..."
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-700/60 bg-zinc-800/30 p-4 transition hover:border-zinc-600">
              <input
                type="checkbox"
                checked={mechanicalStress}
                onChange={(e) => setMechanicalStress(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-violet-500 focus:ring-violet-500"
              />
              <div>
                <span className="font-medium text-white">
                  Will this part experience mechanical stress?
                </span>
                <p className="mt-1 text-sm text-zinc-500">
                  Load-bearing, vibration, heat exposure, or moving assemblies require reinforced design.
                </p>
              </div>
            </label>
          </div>

          {estimate && (
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-5">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-400">
                Smart Estimate
              </h3>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Design Time</p>
                  <p className="text-2xl font-bold text-white">{estimate.timeRange}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Price Range</p>
                  <p className="text-2xl font-bold text-white">
                    ${estimate.priceMin} – ${estimate.priceMax}
                    <span className="text-sm font-normal text-zinc-400"> CAD</span>
                  </p>
                </div>
              </div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                  estimate.complexity === "high"
                    ? "bg-red-500/20 text-red-400"
                    : estimate.complexity === "medium"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {estimate.complexity} complexity
              </span>
            </div>
          )}

          <CustomerForm customer={customer} onChange={setCustomer} />

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleWhatsAppOrder}
            disabled={!estimate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>💬</span>
            Confirm Order via WhatsApp
          </button>

          <LocationBadges />
        </div>
      </div>

      <WhatsAppModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}
