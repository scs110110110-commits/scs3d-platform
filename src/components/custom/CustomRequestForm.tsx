"use client";

import { useState } from "react";
import { BRAND_NAME, BRAND_URL, WHATSAPP_NUMBER } from "@/lib/config";

export default function CustomRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)].slice(0, 6));
  }

  function buildMessage(): string {
    return [
      `Hi ${BRAND_NAME}! I have a custom 3D print / CAD request from ${BRAND_URL}:`,
      "",
      name.trim() ? `Name: ${name.trim()}` : null,
      email.trim() ? `Email: ${email.trim()}` : null,
      "",
      `Idea: ${idea.trim()}`,
      dimensions.trim() ? `Dimensions: ${dimensions.trim()}` : null,
      "",
      `Reference photos: ${images.length} attached in this chat`,
      "",
      "Please send me a quote for this custom project.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function handleSubmit() {
    setError("");
    if (!idea.trim()) {
      setError("Please describe your idea.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one reference photo.");
      return;
    }

    const message = buildMessage();
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // clipboard optional
    }

    setShowModal(true);
    setTimeout(() => {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }, 600);
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <label className="mb-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-14 transition hover:border-cyan-500/50 hover:bg-zinc-900/60">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">
              📷
            </div>
            <p className="font-semibold text-white">Upload reference photos</p>
            <p className="mt-1 text-sm text-zinc-500">JPG, PNG — up to 6 images</p>
          </label>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={`${img.name}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(img)} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Describe your idea *
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={5}
              placeholder="What do you want printed? Purpose, style, features, material preferences..."
              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Approximate dimensions (optional)
            </label>
            <input
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 10 x 5 x 3 cm"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-semibold text-white transition hover:bg-emerald-500"
          >
            Send via WhatsApp
          </button>

          <p className="text-center text-xs text-zinc-600">
            Your message will open in WhatsApp — attach your photos in the chat.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative max-w-md rounded-2xl border border-emerald-500/30 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-bold text-white">Opening WhatsApp</h3>
            <p className="mb-4 text-zinc-400">
              Your request details are copied. Please attach your reference photos in the WhatsApp chat.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
