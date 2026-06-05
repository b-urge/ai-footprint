import type { DailyStats } from "./storage";

const DASHBOARD_BASE = "https://ai-footprint-plum.vercel.app";

export function buildDashboardUrl(stats: DailyStats | null): string {
  if (!stats || stats.messageCount === 0) {
    return `${DASHBOARD_BASE}?from=extension`;
  }
  const params = new URLSearchParams({
    from: "extension",
    tokens: String(Math.round(stats.tokens)),
    water: stats.waterMl.toFixed(3),
    energy: stats.energyWh.toFixed(4),
    co2: stats.co2Grams.toFixed(4),
    messages: String(stats.messageCount),
    model: "claude-sonnet",
  });
  return `${DASHBOARD_BASE}?${params.toString()}`;
}
