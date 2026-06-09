import type { CadEstimate } from "./types";

export type Unit = "cm" | "inch";

export interface CadFormData {
  length: number;
  width: number;
  height: number;
  unit: Unit;
  purpose: string;
  mechanicalStress: boolean;
  imageCount: number;
}

const COMPLEXITY_KEYWORDS = [
  "gear",
  "thread",
  "snap",
  "hinge",
  "bearing",
  "tolerance",
  "mechanical",
  "assembly",
  "interlock",
  "mount",
  "bracket",
  "enclosure",
  "automotive",
  "dişli",
  "vida",
  "menteşe",
  "montaj",
];

function toCm(value: number, unit: Unit): number {
  return unit === "inch" ? value * 2.54 : value;
}

function getVolumeScore(length: number, width: number, height: number): number {
  const volume = length * width * height;
  if (volume < 50) return 1;
  if (volume < 200) return 1.5;
  if (volume < 1000) return 2.2;
  if (volume < 5000) return 3;
  return 4.5;
}

function getComplexityScore(purpose: string, mechanical: boolean): number {
  const lower = purpose.toLowerCase();
  let score = mechanical ? 1.5 : 1;
  const matches = COMPLEXITY_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  score += matches * 0.4;
  if (purpose.length > 120) score += 0.5;
  if (purpose.length > 250) score += 0.5;
  return Math.min(score, 4);
}

export function estimateCadDesign(data: CadFormData): CadEstimate {
  const lengthCm = toCm(data.length, data.unit);
  const widthCm = toCm(data.width, data.unit);
  const heightCm = toCm(data.height, data.unit);

  const volumeScore = getVolumeScore(lengthCm, widthCm, heightCm);
  const complexityScore = getComplexityScore(data.purpose, data.mechanicalStress);
  const imageBonus = Math.min(data.imageCount * 0.15, 0.6);
  const totalScore = volumeScore + complexityScore + imageBonus;

  let complexity: CadEstimate["complexity"] = "low";
  if (totalScore >= 5) complexity = "high";
  else if (totalScore >= 3) complexity = "medium";

  const baseHours = 1;
  const extraHours = Math.ceil(totalScore / 2);
  const minHours = baseHours + Math.floor(extraHours * 0.5);
  const maxHours = baseHours + extraHours;

  const basePrice = 35;
  const priceMin = Math.round(basePrice + totalScore * 8);
  const priceMax = Math.round(priceMin + totalScore * 12 + (data.mechanicalStress ? 15 : 0));

  const timeRange =
    minHours === maxHours
      ? `${minHours} hour${minHours > 1 ? "s" : ""}`
      : `${minHours}-${maxHours} hours`;

  return {
    timeRange,
    priceMin: Math.max(priceMin, 40),
    priceMax: Math.max(priceMax, priceMin + 20),
    complexity,
  };
}
