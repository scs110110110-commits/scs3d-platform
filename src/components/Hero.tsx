export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Kitchener-Waterloo · Canada
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-6xl">
          3D Printing &amp; CAD Design
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Instant Pricing Platform
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400">
          Upload a 3D model for an instant print quote, or send reference photos for
          custom CAD design. Everything calculated client-side — no server costs, no
          waiting.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#instant-quote"
            className="w-full rounded-xl bg-cyan-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-cyan-500 sm:w-auto"
          >
            🎯 Instant 3D Quote
          </a>
          <a
            href="#photo-to-print"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-8 py-4 text-lg font-semibold text-white transition hover:border-zinc-500 sm:w-auto"
          >
            📸 Photo-to-Print CAD
          </a>
        </div>
      </div>
    </section>
  );
}
