import type { ScoutSource } from "./types";

export const SCOUT_SOURCES: ScoutSource[] = [
  {
    id: "printables",
    name: "Printables",
    url: "https://www.printables.com/search/models?licenses=7%3A0&ordering=-popularity",
    description: "En çok indirilen ve beğenilen modeller",
    icon: "🖨️",
    checkFrequency: "Günlük",
  },
  {
    id: "thingiverse",
    name: "Thingiverse",
    url: "https://www.thingiverse.com/search?q=popular&page=1",
    description: "Klasik topluluk trendleri",
    icon: "🔧",
    checkFrequency: "Günlük",
  },
  {
    id: "etsy",
    name: "Etsy 3D Prints",
    url: "https://www.etsy.com/search?q=3d+printed&order=most_relevant",
    description: "Satışta olan popüler baskılar ve fiyat referansı",
    icon: "🛒",
    checkFrequency: "Günlük",
  },
  {
    id: "reddit",
    name: "r/3Dprinting",
    url: "https://www.reddit.com/r/3Dprinting/top/?t=week",
    description: "Haftalık viral baskılar ve talep sinyalleri",
    icon: "💬",
    checkFrequency: "Haftalık",
  },
  {
    id: "myminifactory",
    name: "MyMiniFactory",
    url: "https://www.myminifactory.com/search/?sort=popularity",
    description: "Koleksiyon ve minyatür trendleri",
    icon: "🐉",
    checkFrequency: "Günlük",
  },
  {
    id: "tiktok",
    name: "TikTok #3dprint",
    url: "https://www.tiktok.com/tag/3dprint",
    description: "Viral ürün fikirleri ve estetik trendler",
    icon: "📱",
    checkFrequency: "Günlük",
  },
];

export const DAILY_SCOUT_GOAL = 10;
