import type { Metadata } from "next";
import CatalogPage from "@/components/catalog/CatalogPage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicShell from "@/components/PublicShell";
import { SOLUTIONS_TAGLINE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Custom Solutions — Customer Designs & Prints",
  description: SOLUTIONS_TAGLINE,
};

export default function SolutionsPage() {
  return (
    <PublicShell>
      <Header />
      <main className="flex-1">
        <CatalogPage section="solutions" />
      </main>
      <Footer />
    </PublicShell>
  );
}
