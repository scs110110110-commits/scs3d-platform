"use client";

import { useMemo, useState } from "react";
import {
  FILAMENT_COLORS,
  INFILL_OPTIONS,
  MATERIALS,
  type InfillKey,
  type MaterialKey,
} from "@/lib/config";
import { analyzeModelFile } from "@/lib/modelParser";
import {
  calculatePrintQuote,
  formatDimensions,
  formatFileSize,
} from "@/lib/pricing";
import type { ModelAnalysis } from "@/lib/types";
import {
  buildPrintReceipt,
  copyToClipboard,
  getWhatsAppUrl,
  type CustomerDetails,
} from "@/lib/whatsapp";
import CustomerForm from "./CustomerForm";
import FileDropzone from "./FileDropzone";
import LocationBadges from "./LocationBadges";
import WhatsAppModal from "./WhatsAppModal";

export default function InstantQuote() {
  const [analysis, setAnalysis] = useState<ModelAnalysis | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [material, setMaterial] = useState<MaterialKey>("PLA");
  const [infill, setInfill] = useState<InfillKey>("medium");
  const [color, setColor] = useState<string>(FILAMENT_COLORS[0].hex);
  const [customer, setCustomer] = useState<CustomerDetails>({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const quote = useMemo(() => {
    if (!analysis) return null;
    return calculatePrintQuote(analysis, material, infill);
  }, [analysis, material, infill]);

  async function handleFileUpload(file: File) {
    setLoading(true);
    setError(null);
    setModelFile(file);
    try {
      const result = await analyzeModelFile(file);
      setAnalysis(result);
    } catch (err) {
      setAnalysis(null);
      setError(err instanceof Error ? err.message : "Dosya analiz edilemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleWhatsAppOrder() {
    if (!analysis || !quote) return;
    if (!customer.name.trim() || !customer.email.trim()) {
      setError("Lütfen ad ve e-posta bilgilerinizi girin.");
      return;
    }

    const receipt = buildPrintReceipt({
      analysis,
      quote,
      material,
      infill,
      color,
      customer,
    });

    await copyToClipboard(receipt);
    setShowModal(true);

    setTimeout(() => {
      window.open(getWhatsAppUrl(receipt), "_blank");
    }, 800);
  }

  return (
    <section id="instant-quote" className="scroll-mt-24">
      <div className="mb-8">
        <span className="mb-3 inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Flow 1
        </span>
        <h2 className="mb-2 text-3xl font-bold text-white">
          Smart 3D Model Pricer
        </h2>
        <p className="text-zinc-400">
          Upload your model and get an instant quote. All calculations run locally in your browser.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <FileDropzone
            accept=".stl,.obj,.3mf"
            label="Drop your 3D model here"
            hint="Supports .stl, .obj, .3mf — analyzed client-side"
            icon="🎯"
            onFile={handleFileUpload}
            currentFile={modelFile}
          />

          {loading && (
            <div className="flex items-center gap-3 rounded-xl bg-zinc-800/60 px-4 py-3 text-cyan-400">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              Analyzing geometry...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {analysis && (
            <div className="rounded-2xl border border-zinc-700/80 bg-zinc-800/40 p-5">
              <h3 className="mb-3 font-semibold text-white">File Analysis</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-zinc-500">Dimensions</dt>
                  <dd className="font-mono text-cyan-300">
                    {formatDimensions(analysis.dimensions)}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Volume</dt>
                  <dd className="font-mono text-cyan-300">
                    {(analysis.volumeMm3 / 1000).toFixed(2)} cm³
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Triangles</dt>
                  <dd className="font-mono text-zinc-300">
                    {analysis.triangleCount.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">File Size</dt>
                  <dd className="font-mono text-zinc-300">
                    {formatFileSize(analysis.fileSize)}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-700/80 bg-zinc-800/40 p-5">
            <h3 className="mb-4 font-semibold text-white">Print Parameters</h3>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-zinc-400">Material</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(MATERIALS) as MaterialKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setMaterial(key)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                      material === key
                        ? "bg-cyan-600 text-white"
                        : "bg-zinc-700/60 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    <div>{MATERIALS[key].label}</div>
                    <div className="text-xs opacity-70">
                      ${MATERIALS[key].pricePerGram}/g
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-zinc-400">Infill Density</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(INFILL_OPTIONS) as InfillKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setInfill(key)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                      infill === key
                        ? "bg-cyan-600 text-white"
                        : "bg-zinc-700/60 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    <div>{INFILL_OPTIONS[key].label}</div>
                    <div className="text-xs opacity-70">
                      {INFILL_OPTIONS[key].percent}%
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Filament Color</label>
              <div className="flex flex-wrap gap-2">
                {FILAMENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      color === c.hex
                        ? "border-cyan-400 ring-2 ring-cyan-400/40"
                        : "border-zinc-600 hover:border-zinc-400"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {FILAMENT_COLORS.find((c) => c.hex === color)?.name}
              </p>
            </div>
          </div>

          {quote && (
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent p-5">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-cyan-400">
                Instant Quote
              </h3>
              <div className="mb-1 text-4xl font-bold text-white">
                ${quote.total.toFixed(2)}{" "}
                <span className="text-lg font-normal text-zinc-400">CAD</span>
              </div>
              <div className="space-y-1 text-sm text-zinc-400">
                <p>Material: ${quote.materialCost.toFixed(2)} (~{quote.estimatedGrams}g)</p>
                <p>Setup / Print Prep: ${quote.setupFee.toFixed(2)}</p>
              </div>
            </div>
          )}

          <CustomerForm customer={customer} onChange={setCustomer} />

          <button
            onClick={handleWhatsAppOrder}
            disabled={!analysis || !quote}
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
