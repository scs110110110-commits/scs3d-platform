export default function BackgroundLogo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      <div className="flex h-full w-full items-center justify-center bg-black px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/scs3d-logo.png"
          alt=""
          draggable={false}
          className="select-none object-contain mix-blend-lighten opacity-[0.22] sm:opacity-[0.24] md:opacity-[0.26] w-[min(98vw,40rem)] max-h-[min(72vh,36rem)] sm:w-[min(96vw,52rem)] sm:max-h-[min(78vh,44rem)] md:w-[min(92vw,64rem)] md:max-h-[min(82vh,50rem)] lg:w-[min(88vw,72rem)]"
        />
      </div>
    </div>
  );
}
