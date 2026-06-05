export function BackgroundEffects() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Dot grid */}
      <div className="bg-dot-grid absolute inset-0" />

      {/* Tiled noise texture */}
      <div
        className="bg-noise-tile absolute inset-0"
        style={{
          backgroundImage: "url(/noise.svg)",
        }}
      />

      {/* Slow scanline sweep */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div className="scanline-sweep absolute inset-x-0 h-full" />
      </div>
    </div>
  );
}
