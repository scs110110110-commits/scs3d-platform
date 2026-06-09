import {
  FILAMENT_COLORS,
  INFILL_OPTIONS,
  MATERIALS,
  WHATSAPP_NUMBER,
  type InfillKey,
  type MaterialKey,
} from "./config";
import type { CadEstimate } from "./types";
import { formatDimensions } from "./pricing";
import type { ModelAnalysis, PrintQuote } from "./types";

export interface CustomerDetails {
  name: string;
  email: string;
  notes?: string;
}

export function buildPrintReceipt(params: {
  analysis: ModelAnalysis;
  quote: PrintQuote;
  material: MaterialKey;
  infill: InfillKey;
  color: string;
  customer: CustomerDetails;
}): string {
  const { analysis, quote, material, infill, color, customer } = params;
  const colorName = FILAMENT_COLORS.find((c) => c.hex === color)?.name || color;

  return [
    "━━━━━━━━━━━━━━━━━━━━━━",
    "   SCS3D ÜRETİM FİŞİ",
    "   scs3d.com",
    "━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "📋 SİPARİŞ TİPİ: 3D Baskı (Instant Quote)",
    "",
    "👤 MÜŞTERİ",
    `   Ad: ${customer.name}`,
    `   E-posta: ${customer.email}`,
    customer.notes ? `   Not: ${customer.notes}` : null,
    "",
    "📁 DOSYA",
    `   Ad: ${analysis.fileName}`,
    `   Format: ${analysis.format.toUpperCase()}`,
    `   Boyut: ${formatDimensions(analysis.dimensions)}`,
    `   Hacim: ${(analysis.volumeMm3 / 1000).toFixed(2)} cm³`,
    `   Üçgen: ${analysis.triangleCount.toLocaleString()}`,
    "",
    "⚙️ BASKI PARAMETRELERİ",
    `   Malzeme: ${MATERIALS[material].label}`,
    `   Doluluk: ${INFILL_OPTIONS[infill].label} (%${INFILL_OPTIONS[infill].percent})`,
    `   Renk: ${colorName}`,
    "",
    "💰 FİYAT (CAD)",
    `   Malzeme: $${quote.materialCost.toFixed(2)}`,
    `   Tahmini Gramaj: ${quote.estimatedGrams}g`,
    `   Kurulum Ücreti: $${quote.setupFee.toFixed(2)}`,
    `   ─────────────────`,
    `   TOPLAM: $${quote.total.toFixed(2)} CAD`,
    "",
    "📎 Lütfen 3D dosyanızı bu sohbete ekleyin.",
    "━━━━━━━━━━━━━━━━━━━━━━",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildCadReceipt(params: {
  estimate: CadEstimate;
  dimensions: string;
  purpose: string;
  mechanicalStress: boolean;
  imageCount: number;
  customer: CustomerDetails;
}): string {
  const { estimate, dimensions, purpose, mechanicalStress, imageCount, customer } = params;

  return [
    "━━━━━━━━━━━━━━━━━━━━━━",
    "   SCS3D ÜRETİM FİŞİ",
    "   scs3d.com",
    "━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "📋 SİPARİŞ TİPİ: CAD Tasarım (Photo-to-Print)",
    "",
    "👤 MÜŞTERİ",
    `   Ad: ${customer.name}`,
    `   E-posta: ${customer.email}`,
    customer.notes ? `   Not: ${customer.notes}` : null,
    "",
    "📐 TASARIM DETAYLARI",
    `   Boyutlar: ${dimensions}`,
    `   Amaç: ${purpose}`,
    `   Mekanik Zorlanma: ${mechanicalStress ? "Evet" : "Hayır"}`,
    `   Referans Görsel: ${imageCount} adet`,
    `   Karmaşıklık: ${estimate.complexity.toUpperCase()}`,
    "",
    "⏱️ TAHMİN",
    `   Tasarım Süresi: ${estimate.timeRange}`,
    `   Fiyat Aralığı: $${estimate.priceMin} - $${estimate.priceMax} CAD`,
    "",
    "📎 Lütfen referans fotoğraflarınızı bu sohbete ekleyin.",
    "━━━━━━━━━━━━━━━━━━━━━━",
  ]
    .filter(Boolean)
    .join("\n");
}

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}
