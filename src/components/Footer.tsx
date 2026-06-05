const SOURCES = [
  {
    label: "Making AI Less Thirsty (Ren et al., 2023)",
    href: "https://arxiv.org/abs/2304.03271",
  },
  {
    label: "IEA Electricity 2024",
    href: "https://www.iea.org/reports/electricity-2024",
  },
  {
    label: "US EPA eGRID",
    href: "https://www.epa.gov/egrid",
  },
];

export function Footer() {
  return (
    <footer className="footer-gradient-border relative z-10 mt-12 px-4 py-8 sm:mt-16 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl gap-8 text-xs text-text-muted md:grid-cols-3">
        <div>
          <h3 className="font-display mb-2 text-[10px] font-semibold tracking-widest text-text-secondary">
            DATA SOURCES
          </h3>
          <ul className="font-body space-y-1.5 font-light">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:text-text-secondary hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display mb-2 text-[10px] font-semibold tracking-widest text-text-secondary">
            METHODOLOGY
          </h3>
          <p className="font-body font-light leading-relaxed">
            Token estimates use a 1:4 character ratio for prose and 1:3 for
            code blocks (±15% typical error). Per-1K-token water, energy, and
            CO₂ rates are scaled by model size multipliers — illustrative
            magnitudes, not billing-grade figures.
          </p>
        </div>
        <div>
          <h3 className="font-display mb-2 text-[10px] font-semibold tracking-widest text-text-secondary">
            CREDITS
          </h3>
          <p className="font-body font-light leading-relaxed">
            Built for hackathon demonstration. All computation runs client-side;
            no conversation data is transmitted.
          </p>
        </div>
      </div>
    </footer>
  );
}
