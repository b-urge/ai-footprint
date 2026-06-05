import type { DailyStats } from "./storage";

const DASHBOARD_BASE = "https://ai-footprint-plum.vercel.app";

export function buildDashboardUrl(stats: DailyStats | null): string {
  const params = new URLSearchParams({ from: "extension" });
  if (stats) {
    params.set("tokens", String(Math.round(stats.tokens)));
    params.set("water", stats.waterMl.toFixed(3));
    params.set("energy", stats.energyWh.toFixed(4));
    params.set("co2", stats.co2Grams.toFixed(4));
    params.set("messages", String(stats.messageCount));
    params.set("model", "claude-sonnet");
  }
  return `${DASHBOARD_BASE}?${params.toString()}`;
}
