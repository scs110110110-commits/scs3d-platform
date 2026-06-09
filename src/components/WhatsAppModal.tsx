"use client";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-labelledby="whatsapp-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-zinc-900 p-6 shadow-2xl shadow-emerald-500/10"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-3xl">
          ✓
        </div>
        <h2 id="whatsapp-modal-title" className="mb-2 text-xl font-semibold text-white">
          Your production details are saved!
        </h2>
        <p className="mb-6 text-zinc-400">
          Please paste this text and attach your photos/files in the WhatsApp chat.
        </p>
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-500"
        >
          Got it — Opening WhatsApp
        </button>
      </div>
    </div>
  );
}
