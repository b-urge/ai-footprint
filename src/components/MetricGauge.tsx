"use client";

import { useEffect, useMemo, useState } from "react";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { getDecimalPlaces } from "@/utils/format";

export type MetricCategory = "water" | "energy" | "co2";

interface MetricGaugeProps {
  category: MetricCategory;
  label: string;
  value: number;
  unit: string;
  icon: string;
  preview?: string;
  isEmpty?: boolean;
}

const CATEGORY_STYLES: Record<
  MetricCategory,
  {
    gradient: string;
    glow: string;
    text: string;
  }
> = {
  water: {
    gradient: "linear-gradient(to top, #0c4a6e, #0ea5e9)",
    glow: "var(--accent-water-glow)",
    text: "text-accent-water",
  },
  energy: {
    gradient: "linear-gradient(to top, #78350f, #f59e0b)",
    glow: "var(--accent-energy-glow)",
    text: "text-accent-energy",
  },
  co2: {
    gradient: "linear-gradient(to top, #7f1d1d, #ef4444)",
    glow: "var(--accent-co2-glow)",
    text: "text-accent-co2",
  },
};

function nextScale(current: number, value: number): number {
  const scales = [10, 100, 1000, 10000, 100000];
  if (value <= current * 0.8) return current;
  const idx = scales.findIndex((s) => s === current);
  const next = scales[idx + 1] ?? current * 10;
  return value > current * 0.8 ? next : current;
}

export function MetricGauge({
  category,
  label,
  value,
  unit,
  icon,
  preview,
  isEmpty = false,
}: MetricGaugeProps) {
  const styles = CATEGORY_STYLES[category];
  const [maxScale, setMaxScale] = useState(() =>
    Math.max(10, value > 0 ? value / 0.5 : 10)
  );

  useEffect(() => {
    setMaxScale((prev) => nextScale(prev, value));
  }, [value]);

  const fillPct = Math.min(100, (value / maxScale) * 100);
  const precision = getDecimalPlaces(value);
  const animatedValue = useAnimatedValue(value, 0.08, precision);

  const intensity = fillPct / 100;

  const fillGlowShadow = useMemo(() => {
    const blur = Math.round(intensity * 20);
    const spread = Math.round(intensity * 8);
    return `0 0 ${blur}px ${spread}px color-mix(in srgb, ${styles.glow} ${Math.round(intensity * 40)}%, transparent)`;
  }, [intensity, styles.glow]);

  const cardGlowShadow = useMemo(() => {
    if (value <= 0) return undefined;
    const blur = Math.round(intensity * 24);
    const spread = Math.round(intensity * 10);
    return `0 0 ${blur}px ${spread}px color-mix(in srgb, ${styles.glow} ${Math.round(intensity * 22)}%, transparent)`;
  }, [intensity, styles.glow, value]);

  const radialGlow = useMemo(() => {
    const colors: Record<MetricCategory, string> = {
      water: "rgba(14, 165, 233, 0.15)",
      energy: "rgba(245, 158, 11, 0.12)",
      co2: "rgba(239, 68, 68, 0.12)",
    };
    return `radial-gradient(ellipse 80% 60% at 50% 100%, ${colors[category]} 0%, transparent 70%)`;
  }, [category]);

  return (
    <article
      className={`group flex flex-col rounded-xl border border-border-subtle bg-bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-bg-card-hover ${isEmpty ? "idle-gauge" : ""}`}
      style={{ boxShadow: cardGlowShadow }}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
        <h3
          className={`font-display text-xs font-semibold tracking-widest ${styles.text}`}
        >
          {label}
        </h3>
      </div>

      <div className="relative mx-auto mb-4 h-[150px] w-full max-w-[120px] overflow-hidden rounded-md bg-bg-secondary sm:h-[200px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-80 transition-opacity group-hover:opacity-100"
          style={{ background: radialGlow }}
          aria-hidden
        />
        <div
          className="gauge-fill absolute bottom-0 left-0 right-0 overflow-hidden rounded-md"
          style={{
            height: `${fillPct}%`,
            background: styles.gradient,
            boxShadow: value > 0 ? fillGlowShadow : undefined,
          }}
        >
          <div
            className="gauge-shimmer pointer-events-none absolute inset-x-0 h-1/3 bg-white/20"
            aria-hidden
          />
        </div>
      </div>

      <p className="font-display tabular-nums text-center text-2xl font-bold text-text-primary sm:text-3xl">
        {animatedValue.toLocaleString(undefined, {
          maximumFractionDigits: precision,
          minimumFractionDigits: 0,
        })}{" "}
        <span className="text-base font-medium text-text-secondary">{unit}</span>
      </p>

      {preview ? (
        <p className="mt-2 text-center font-body text-xs text-text-muted">
          {preview}
        </p>
      ) : isEmpty ? (
        <p className="mt-2 text-center font-body text-xs text-text-muted">
          Paste a conversation to measure
        </p>
      ) : null}
    </article>
  );
}
