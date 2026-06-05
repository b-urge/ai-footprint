import { calculateImpact } from "../shared/impactCalculator";
import { SITE_DEFAULT_MODEL } from "../shared/models";
import { addMessageImpact, getSettings } from "../shared/storage";
import { estimateTokens } from "../shared/tokenEstimator";

function badgeColor(waterMl: number): string {
  if (waterMl < 50) return "#10B981";
  if (waterMl < 200) return "#F59E0B";
  return "#EF4444";
}

async function updateBadge(waterMl: number, messageCount = 0): Promise<void> {
  let label = "";
  if (waterMl > 0) {
    if (waterMl < 1) label = "<1";
    else if (waterMl < 1000) label = `${Math.round(waterMl)}`;
    else label = `${(waterMl / 1000).toFixed(1)}k`;
  } else if (messageCount > 0) {
    label = "<1";
  }
  await chrome.action.setBadgeText({ text: label });
  await chrome.action.setBadgeBackgroundColor({
    color:
      messageCount > 0 || waterMl > 0
        ? badgeColor(Math.max(waterMl, 1))
        : "#64748B",
  });
}

import { getTodayStats } from "../shared/storage";

export async function refreshBadgeFromStorage(): Promise<void> {
  const stats = await getTodayStats();
  await updateBadge(stats.waterMl, stats.messageCount);
}

export async function recordText(
  site: "chatgpt" | "claude",
  text: string
): Promise<void> {
  const settings = await getSettings();
  const modelId = SITE_DEFAULT_MODEL[site] ?? settings.defaultModelId;
  const tokens = estimateTokens(text);
  if (tokens < 1) return;
  const impact = calculateImpact(tokens, modelId);
  const stats = await addMessageImpact(
    impact.tokens,
    impact.waterMl,
    impact.energyWh,
    impact.co2Grams
  );
  await updateBadge(stats.waterMl, stats.messageCount);
}
