"use client";

import { useState } from "react";
import { openCustomWhatsAppRequest } from "@/lib/whatsapp";

type ContactMethod = "whatsapp" | "email";

export default function CustomRequestForm() {
  const [method, setMethod] = useState<ContactMethod>("whatsapp");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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

  function validatePhone(): boolean {
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return false;
    }
    return true;
  }

  async function handleWhatsAppSubmit() {
    if (!idea.trim()) {
      setError("Please describe your idea.");
      return;
    }
    if (!validatePhone()) return;

    openCustomWhatsAppRequest({ name, phone, email, idea, dimensions });
    setSuccess(true);
    setError("");
  }

  async function handleEmailSubmit() {
    setError("");
    if (!idea.trim()) {
      setError("Please describe your idea.");
      return;
    }
    if (!validatePhone()) return;
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
      formData.append("phone", phone);
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
      setPhone("");
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
      <div className="mb-4 flex rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-0.5">
        <button
          type="button"
          onClick={() => {
            setMethod("whatsapp");
            setError("");
            setSuccess(false);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
            method === "whatsapp"
              ? "bg-emerald-600/90 text-white"
              : "text-zinc-500 hover:text-zinc-300"
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
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
            method === "email"
              ? "bg-cyan-600/90 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          ✉️ Email
        </button>
      </div>

      <div className={`grid gap-4 ${method === "email" ? "sm:grid-cols-2" : ""}`}>
        {method === "email" && (
          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-8 transition hover:border-zinc-700">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-lg">
                📷
              </div>
              <p className="text-sm font-medium text-zinc-300">Upload photos</p>
              <p className="mt-0.5 text-xs text-zinc-600">JPG, PNG — up to 6</p>
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

        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
                placeholder="+1 519 555 1234"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">
              Email {method === "email" && "*"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Describe your idea *</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              placeholder="What do you want printed?"
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Dimensions (optional)</label>
            <input
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 10 x 5 x 3 cm"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
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
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${
              method === "whatsapp"
                ? "bg-emerald-600/90 hover:bg-emerald-600"
                : "bg-cyan-600/90 hover:bg-cyan-600"
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
