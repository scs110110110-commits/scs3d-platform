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
        <section className="border-b border-zinc-800/40 bg-zinc-950/50">
          <div className="page-wrap py-5 sm:py-6">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-500/80">
              Custom Project
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
              Bring Your Idea to Life
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-zinc-500">
              Describe your project and reach us via WhatsApp or email.
            </p>
          </div>
        </section>

        <section className="py-6 sm:py-8">
          <div className="page-wrap max-w-3xl">
            <CustomRequestForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
