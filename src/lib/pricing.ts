import {
  INFILL_OPTIONS,
  MATERIALS,
  SETUP_FEE_CAD,
  type InfillKey,
  type MaterialKey,
} from "./config";
import type { ModelAnalysis, PrintQuote } from "./types";

const SHELL_FACTOR = 0.18;

export function calculatePrintQuote(
  analysis: ModelAnalysis,
  material: MaterialKey,
  infill: InfillKey
): PrintQuote {
  const mat = MATERIALS[material];
  const infillPercent = INFILL_OPTIONS[infill].percent / 100;

  const volumeCm3 = analysis.volumeMm3 / 1000;
  const effectiveFill = infillPercent * (1 - SHELL_FACTOR) + SHELL_FACTOR;
  const estimatedGrams = volumeCm3 * mat.density * effectiveFill;
  const materialCost = estimatedGrams * mat.pricePerGram;

  return {
    materialCost: Math.round(materialCost * 100) / 100,
    setupFee: SETUP_FEE_CAD,
    total: Math.round((materialCost + SETUP_FEE_CAD) * 100) / 100,
    estimatedGrams: Math.round(estimatedGrams * 10) / 10,
  };
}

export function formatDimensions(dims: ModelAnalysis["dimensions"]): string {
  return `${dims.x.toFixed(1)} × ${dims.y.toFixed(1)} × ${dims.z.toFixed(1)} mm`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
