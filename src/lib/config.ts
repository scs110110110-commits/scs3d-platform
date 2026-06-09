export const WHATSAPP_NUMBER = "15485777916";

export const SETUP_FEE_CAD = 5;

export const MATERIALS = {
  PLA: { label: "PLA", pricePerGram: 0.05, density: 1.24 },
  PETG: { label: "PETG", pricePerGram: 0.07, density: 1.27 },
  TPU: { label: "TPU", pricePerGram: 0.12, density: 1.21 },
} as const;

export type MaterialKey = keyof typeof MATERIALS;

export const INFILL_OPTIONS = {
  light: { label: "Light", percent: 10 },
  medium: { label: "Medium", percent: 20 },
  heavy: { label: "Heavy", percent: 50 },
} as const;

export type InfillKey = keyof typeof INFILL_OPTIONS;

export const FILAMENT_COLORS = [
  { name: "Matte Black", hex: "#1a1a1a" },
  { name: "Pure White", hex: "#f5f5f5" },
  { name: "Signal Red", hex: "#e63946" },
  { name: "Ocean Blue", hex: "#2563eb" },
  { name: "Forest Green", hex: "#16a34a" },
  { name: "Sunset Orange", hex: "#ea580c" },
  { name: "Royal Purple", hex: "#7c3aed" },
  { name: "Silver Grey", hex: "#9ca3af" },
  { name: "Gold Silk", hex: "#d4a017" },
  { name: "Transparent", hex: "#94a3b8" },
] as const;
