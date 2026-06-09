import type { ScoutSource } from "./types";

export const SCOUT_SOURCES: ScoutSource[] = [
  {
    id: "printables",
    name: "Printables",
    url: "https://www.printables.com/search/models?licenses=7%3A0&ordering=-popularity",
    description: "Most downloaded and liked models",
    icon: "🖨️",
    checkFrequency: "Daily",
  },
  {
    id: "thingiverse",
    name: "Thingiverse",
    url: "https://www.thingiverse.com/search?q=popular&page=1",
    description: "Classic community trends",
    icon: "🔧",
    checkFrequency: "Daily",
  },
  {
    id: "etsy",
    name: "Etsy 3D Prints",
    url: "https://www.etsy.com/search?q=3d+printed&order=most_relevant",
    description: "Popular prints for sale and price reference",
    icon: "🛒",
    checkFrequency: "Daily",
  },
  {
    id: "reddit",
    name: "r/3Dprinting",
    url: "https://www.reddit.com/r/3Dprinting/top/?t=week",
    description: "Weekly viral prints and demand signals",
    icon: "💬",
    checkFrequency: "Weekly",
  },
  {
    id: "myminifactory",
    name: "MyMiniFactory",
    url: "https://www.myminifactory.com/search/?sort=popularity",
    description: "Collectibles and miniature trends",
    icon: "🐉",
    checkFrequency: "Daily",
  },
  {
    id: "tiktok",
    name: "TikTok #3dprint",
    url: "https://www.tiktok.com/tag/3dprint",
    description: "Viral product ideas and aesthetic trends",
    icon: "📱",
    checkFrequency: "Daily",
  },
];

export const DAILY_SCOUT_GOAL = 10;
