export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ModelAnalysis {
  fileName: string;
  fileSize: number;
  format: "stl" | "obj" | "3mf";
  volumeMm3: number;
  dimensions: { x: number; y: number; z: number };
  triangleCount: number;
  vertexCount: number;
}

export interface PrintQuote {
  materialCost: number;
  setupFee: number;
  total: number;
  estimatedGrams: number;
}

export interface CadEstimate {
  timeRange: string;
  priceMin: number;
  priceMax: number;
  complexity: "low" | "medium" | "high";
}
