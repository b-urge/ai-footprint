import { calculateImpact } from "../shared/impactCalculator";
import { SITE_DEFAULT_MODEL } from "../shared/models";
import { addMessageImpact, getSettings, getTodayStats } from "../shared/storage";
import { estimateTokens } from "../shared/tokenEstimator";
import type { ExtensionMessage } from "../messages";

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
    // Tracked messages but sub-milliliter total — still show activity
    label = "<1";
  }
  await chrome.action.setBadgeText({ text: label });
  await chrome.action.setBadgeBackgroundColor({
    color: messageCount > 0 || waterMl > 0 ? badgeColor(Math.max(waterMl, 1)) : "#64748B",
  });
}

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type !== "ASSISTANT_MESSAGE") return;

    void (async () => {
      const settings = await getSettings();
      const modelId = SITE_DEFAULT_MODEL[message.site] ?? settings.defaultModelId;
      const tokens = estimateTokens(message.text);
      if (tokens < 1) {
        sendResponse({ ok: false });
        return;
      }
      const impact = calculateImpact(tokens, modelId);
      const stats = await addMessageImpact(
        impact.tokens,
        impact.waterMl,
        impact.energyWh,
        impact.co2Grams
      );
      await updateBadge(stats.waterMl, stats.messageCount);
      sendResponse({ ok: true, stats });
    })();

    return true;
  }
);

async function refreshBadgeFromStorage(): Promise<void> {
  const stats = await getTodayStats();
  await updateBadge(stats.waterMl, stats.messageCount);
}

chrome.runtime.onInstalled.addListener(() => {
  void refreshBadgeFromStorage();
});

void refreshBadgeFromStorage();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && Object.keys(changes).some((k) => k.startsWith("daily:"))) {
    void refreshBadgeFromStorage();
  }
});
