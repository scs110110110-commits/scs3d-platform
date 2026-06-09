import { zipSync } from "fflate";
import { WHATSAPP_NUMBER } from "./config";

export type ShareMethod = "native-share" | "zip-download";

export interface ShareResult {
  method: ShareMethod;
  message: string;
}

async function zipImages(files: File[]): Promise<Blob> {
  const entries: Record<string, Uint8Array> = {};

  for (let i = 0; i < files.length; i++) {
    const buffer = new Uint8Array(await files[i].arrayBuffer());
    const ext = files[i].name.split(".").pop()?.toLowerCase() || "jpg";
    entries[`reference-${i + 1}.${ext}`] = buffer;
  }

  const zipped = zipSync(entries);
  return new Blob([new Uint8Array(zipped)], { type: "application/zip" });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function openWhatsAppText(message: string) {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

export async function shareCustomRequest(
  message: string,
  images: File[]
): Promise<ShareResult> {
  const sharePayload = { text: message, files: images };

  if (
    typeof navigator !== "undefined" &&
    navigator.share &&
    navigator.canShare?.(sharePayload)
  ) {
    try {
      await navigator.share(sharePayload);
      return { method: "native-share", message };
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        throw new Error("Share cancelled.");
      }
    }
  }

  const zip = await zipImages(images);
  downloadBlob(zip, "scs3d-reference-photos.zip");

  const fallbackMessage = [
    message,
    "",
    `📎 ${images.length} reference photo(s) downloaded to your device.`,
    "Please attach them in this chat using the 📎 button.",
  ].join("\n");

  try {
    await navigator.clipboard.writeText(fallbackMessage);
  } catch {
    // optional
  }

  setTimeout(() => openWhatsAppText(fallbackMessage), 400);

  return { method: "zip-download", message: fallbackMessage };
}
