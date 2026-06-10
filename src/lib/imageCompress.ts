const MAX_EDGE = 1200;
const JPEG_QUALITY = 0.82;
const TARGET_BYTES = 450_000;

export async function compressImageFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image canvas.");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = JPEG_QUALITY;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);

  while (dataUrl.length > TARGET_BYTES * 1.37 && quality > 0.45) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  return dataUrl;
}

export async function compressDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith("data:image/")) return dataUrl;

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return compressImageFile(new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" }));
}
