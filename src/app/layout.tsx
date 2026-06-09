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
  title: "SCS3D — 3D Printing & CAD Design | Instant Quote",
  description:
    "Professional 3D printing and CAD design services in Kitchener-Waterloo. Upload your model for an instant quote or send photos for custom design.",
  keywords: ["3D printing", "CAD design", "Kitchener", "Waterloo", "SCS3D", "instant quote"],
  openGraph: {
    title: "SCS3D — 3D Printing & CAD Design",
    description: "Instant 3D print quotes and photo-to-print CAD design automation.",
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
