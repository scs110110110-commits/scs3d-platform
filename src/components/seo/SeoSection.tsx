export default function SeoSection() {
  return (
    <section className="border-t border-zinc-800/80 bg-zinc-900/30 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
          Kitchener-Waterloo 3D Design &amp; Printing Service
        </h2>
        <div className="prose prose-invert max-w-none text-zinc-400">
          <p className="mb-4 leading-relaxed">
            <strong className="text-zinc-200">SCS3D</strong> is your local{" "}
            <strong className="text-zinc-200">
              Kitchener-Waterloo 3D design and printing service
            </strong>
            . We specialize in trending 3D printed products, rapid prototyping,
            and custom CAD design for makers, small businesses, and everyday
            customers across the Waterloo Region.
          </p>
          <p className="mb-4 leading-relaxed">
            Whether you need a viral articulating dragon, a desk organizer, an
            automotive part, or a fully custom design from a reference photo — we
            deliver professional 3D printing in PLA, PETG, and specialty
            materials with fast turnaround and{" "}
            <strong className="text-zinc-200">local pickup in Kitchener-Waterloo</strong>.
          </p>
          <p className="leading-relaxed">
            Browse our daily trending catalog and order instantly via WhatsApp.
            Serving Kitchener, Waterloo, Cambridge, and shipping across Canada.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {[
            "3D Printing Kitchener",
            "3D Printing Waterloo",
            "CAD Design Service",
            "Custom 3D Prints",
            "Local Pickup",
            "Canada Shipping",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
