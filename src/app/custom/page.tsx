import type { Metadata } from "next";
import CustomRequestForm from "@/components/custom/CustomRequestForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicShell from "@/components/PublicShell";

export const metadata: Metadata = {
  title: "Custom Request",
  description:
    "Submit your custom 3D print or CAD design idea with reference photos. Get a quote via WhatsApp.",
};

export default function CustomPage() {
  return (
    <PublicShell>
      <Header />
      <main className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="page-wrap grid gap-6 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
            <div>
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                SCS3D · Custom
              </p>
              <h1 className="text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--foreground)]">
                Bring your idea to life
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
                Describe the print, share dimensions, and reach us on WhatsApp or email — made to
                order in Kitchener–Waterloo.
              </p>
            </div>
            <aside className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-2)]">
                Typical turnaround
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                Quote in hours · Print in days
              </p>
            </aside>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="page-wrap max-w-3xl">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-7">
              <CustomRequestForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PublicShell>
  );
}
