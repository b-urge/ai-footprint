"use client";

import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import type { Comparison } from "@/utils/comparisons";
import { formatComparisonValue } from "@/utils/format";

const CATEGORY_BORDER: Record<Comparison["category"], string> = {
  water: "hover:border-accent-water/30",
  energy: "hover:border-accent-energy/30",
  co2: "hover:border-accent-co2/30",
};

interface ComparisonCardProps {
  comparison: Comparison;
}

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  const dp = comparison.value < 1 ? 2 : comparison.value < 100 ? 1 : 0;
  const animated = useAnimatedValue(comparison.value, 0.08, dp);
  const display = formatComparisonValue(animated);

  return (
    <article
      className={`rounded-lg border border-border-subtle bg-bg-card/60 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 ${CATEGORY_BORDER[comparison.category]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none" aria-hidden>
          {comparison.icon}
        </span>
        <div>
          <p className="font-display tabular-nums text-xl font-semibold text-text-primary">
            {display}
          </p>
          <p className="font-body text-sm text-text-secondary">
            {comparison.label}
          </p>
        </div>
      </div>
    </article>
  );
}
