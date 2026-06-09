import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SCS3D — Trending 3D Prints | Order via WhatsApp",
  description:
    "Discover today's hottest 3D printed products. Order instantly via WhatsApp. Kitchener-Waterloo local pickup.",
  keywords: ["3D printing", "trending", "catalog", "SCS3D", "WhatsApp order"],
  openGraph: {
    title: "SCS3D — Trending 3D Prints",
    description: "Daily curated trending 3D prints. Order in one tap.",
    url: "https://scs3d.com",
    siteName: "SCS3D",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
