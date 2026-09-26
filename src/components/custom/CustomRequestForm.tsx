"use client";

import { useState } from "react";
import { openCustomWhatsAppRequest } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

type ContactMethod = "whatsapp" | "email";

const fieldClass =
  "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent)]";

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
      <div className="mb-5 flex rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
        <button
          type="button"
          onClick={() => {
            setMethod("whatsapp");
            setError("");
            setSuccess(false);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition ${
            method === "whatsapp"
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod("email");
            setError("");
            setSuccess(false);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition ${
            method === "email"
              ? "bg-[var(--foreground)] text-white shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Email
        </button>
      </div>

      <div className={`grid gap-5 ${method === "email" ? "sm:grid-cols-2" : ""}`}>
        {method === "email" && (
          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--background)] px-4 py-10 transition hover:border-[var(--accent)]">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <p className="text-sm font-semibold text-[var(--foreground)]">Upload photos</p>
              <p className="mt-1 text-xs text-[var(--muted)]">JPG, PNG — up to 6</p>
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div
                    key={`${img.name}-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--border)]"
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
                      className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={fieldClass}
                placeholder="+1 519 555 1234"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
              Email {method === "email" && "*"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
              Describe your idea *
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              placeholder="What do you want printed?"
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
              Dimensions (optional)
            </label>
            <input
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 10 x 5 x 3 cm"
              className={fieldClass}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {method === "whatsapp"
                ? "WhatsApp opened with your request. Send the message to complete."
                : "Email sent successfully. We'll get back to you soon."}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting
              ? "Sending…"
              : method === "whatsapp"
                ? "Continue on WhatsApp"
                : "Send via Email"}
          </button>

          <p className="text-center text-xs text-[var(--muted-2)]">
            {method === "whatsapp"
              ? "Opens WhatsApp with your project details — no photos needed."
              : "Photos are attached and sent directly to our team."}
          </p>
        </div>
      </div>
    </>
  );
}
