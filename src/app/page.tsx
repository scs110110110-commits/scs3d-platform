import type { Metadata } from "next";
import CatalogPage from "@/components/catalog/CatalogPage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <CatalogPage />
      </main>
      <Footer />
    </>
  );
}
