import type { Metadata } from "next";
import CustomRequestForm from "@/components/custom/CustomRequestForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Custom Request",
  description:
    "Submit your custom 3D print or CAD design idea with reference photos. Get a quote via WhatsApp.",
};

export default function CustomPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-zinc-800/50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Custom Project
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Bring Your Idea to Life
            </h1>
            <p className="max-w-2xl text-lg text-zinc-400">
              Upload reference photos, describe your project, and send everything to us
              on WhatsApp for a custom quote.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <CustomRequestForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
