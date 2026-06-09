import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InstantQuote from "@/components/InstantQuote";
import PhotoToPrint from "@/components/PhotoToPrint";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="mx-auto max-w-6xl space-y-24 px-4 pb-24 sm:px-6">
          <InstantQuote />
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          <PhotoToPrint />
        </div>
      </main>
      <Footer />
    </>
  );
}
