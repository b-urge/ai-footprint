"use client";

import type { Comparison } from "@/utils/comparisons";
import type { EnvironmentalImpact } from "@/utils/impactCalculator";
import { formatComparisonValue } from "@/utils/format";
import { MetricGauge } from "./MetricGauge";

interface LiveMetricsProps {
  impact: EnvironmentalImpact;
  comparisons: Comparison[];
}

function topPreview(
  comparisons: Comparison[],
  category: Comparison["category"]
): string | undefined {
  const match = comparisons.find((c) => c.category === category);
  if (!match) return undefined;
  const val = formatComparisonValue(match.value);
  return `~ ${val} ${match.label}`;
}

export function LiveMetrics({ impact, comparisons }: LiveMetricsProps) {
  const isEmpty = impact.tokens === 0;

  return (
    <section
      className="mt-6 px-4 sm:mt-8 sm:px-8"
      aria-label="Live environmental metrics"
    >
      <div className="mx-auto w-full max-w-6xl">
        {isEmpty && (
          <p className="mb-4 text-center font-body text-sm font-light text-text-muted">
            Paste an AI conversation to see its footprint
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
          <MetricGauge
            category="water"
            label="WATER"
            value={impact.waterMl}
            unit="mL"
            icon="💧"
            preview={topPreview(comparisons, "water")}
            isEmpty={isEmpty}
          />
          <MetricGauge
            category="energy"
            label="ENERGY"
            value={impact.energyWh}
            unit="Wh"
            icon="⚡"
            preview={topPreview(comparisons, "energy")}
            isEmpty={isEmpty}
          />
          <MetricGauge
            category="co2"
            label="CO₂"
            value={impact.co2Grams}
            unit="g"
            icon="🌫️"
            preview={topPreview(comparisons, "co2")}
            isEmpty={isEmpty}
          />
        </div>
      </div>
    </section>
  );
}
