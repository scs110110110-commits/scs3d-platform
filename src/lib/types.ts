import type { Category, TrendStatus } from "./config";

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  imageUrl: string;
  images: string[];
  category: Category;
  tags: string[];
  trendScore: number;
  status: TrendStatus;
  sourceUrl?: string;
  sourceName?: string;
  material: string;
  published: boolean;
  featured: boolean;
  socialProof: number;
  createdAt: string;
}

export interface ScoutItem {
  id: string;
  title: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  notes: string;
  trendScore: number;
  category: Category;
  scoutedAt: string;
  promoted: boolean;
}

export interface ScoutSource {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  checkFrequency: string;
}
