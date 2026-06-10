"use client";

import { useState } from "react";
import { openCustomWhatsAppRequest } from "@/lib/whatsapp";

type ContactMethod = "whatsapp" | "email";

export default function CustomRequestForm() {
  const [method, setMethod] = useState<ContactMethod>("whatsapp");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)].slice(0, 6));
  }

  async function handleWhatsAppSubmit() {
    if (!idea.trim()) {
      setError("Please describe your idea.");
      return;
    }

    openCustomWhatsAppRequest({ name, email, idea, dimensions });
    setSuccess(true);
    setError("");
  }

  async function handleEmailSubmit() {
    setError("");
    if (!idea.trim()) {
      setError("Please describe your idea.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one reference photo.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("idea", idea);
      formData.append("dimensions", dimensions);
      images.forEach((img) => formData.append("photos", img));

      const res = await fetch("/api/custom/email", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email.");

      setSuccess(true);
      setName("");
      setEmail("");
      setIdea("");
      setDimensions("");
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send email.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    setSuccess(false);
    if (method === "whatsapp") {
      handleWhatsAppSubmit();
    } else {
      handleEmailSubmit();
    }
  }

  return (
    <>
      <div className="mb-8 flex rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1">
        <button
          type="button"
          onClick={() => {
            setMethod("whatsapp");
            setError("");
            setSuccess(false);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            method === "whatsapp"
              ? "bg-emerald-600 text-white shadow-lg"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          💬 WhatsApp
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod("email");
            setError("");
            setSuccess(false);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            method === "email"
              ? "bg-cyan-600 text-white shadow-lg"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          ✉️ Email
        </button>
      </div>

      <div className={`grid gap-8 ${method === "email" ? "lg:grid-cols-2" : ""}`}>
        {method === "email" && (
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
                  <div
                    key={`${img.name}-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(img)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Email {method === "email" && "*"}
              </label>
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

          {success && (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {method === "whatsapp"
                ? "WhatsApp opened with your request. Send the message to complete."
                : "Email sent successfully! We'll get back to you soon."}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold text-white transition disabled:opacity-50 ${
              method === "whatsapp"
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-cyan-600 hover:bg-cyan-500"
            }`}
          >
            {submitting
              ? "Sending..."
              : method === "whatsapp"
                ? "Continue on WhatsApp"
                : "Send via Email"}
          </button>

          <p className="text-center text-xs text-zinc-600">
            {method === "whatsapp"
              ? "Opens WhatsApp with your project details — no photos needed."
              : "Photos are attached and sent directly to our team."}
          </p>
        </div>
      </div>
    </>
  );
}
