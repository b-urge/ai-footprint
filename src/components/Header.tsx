export function Header() {
  return (
    <header className="header-gradient-border px-4 py-5 sm:px-8 sm:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="live-dot h-2 w-2 shrink-0 rounded-full bg-accent-green"
            aria-hidden
          />
          <span className="font-display text-xs font-medium tracking-widest text-accent-green">
            LIVE
          </span>
        </div>
        <h1 className="font-display text-xl font-bold tracking-wider text-text-primary sm:text-3xl md:text-4xl">
          AI CARBON FOOTPRINT
        </h1>
        <p className="font-body max-w-2xl text-sm font-light text-text-secondary sm:text-base">
          Visualizing the hidden environmental cost of AI conversations
        </p>
      </div>
    </header>
  );
}
