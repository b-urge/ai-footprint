import { startAutoPoller, resetTabBaselines } from "./autoPoller";
import { recordText, refreshBadgeFromStorage } from "./recordMessage";
import { getTodayStats } from "../shared/storage";
import type { ExtensionMessage } from "../messages";

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage | { type: "RESET_TAB_BASELINES" }, _sender, sendResponse) => {
    void (async () => {
      try {
        if (message.type === "RESET_TAB_BASELINES") {
          resetTabBaselines();
          sendResponse({ ok: true });
          return;
        }
        if (message.type === "ASSISTANT_MESSAGE" || message.type === "SYNC_CHAT") {
          await recordText(message.site, message.text);
          const stats = await getTodayStats();
          sendResponse({ ok: true, stats });
          return;
        }
        sendResponse({ ok: false });
      } catch {
        sendResponse({ ok: false });
      }
    })();
    return true;
  }
);

chrome.runtime.onInstalled.addListener(() => {
  void refreshBadgeFromStorage();
});

void refreshBadgeFromStorage();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && Object.keys(changes).some((k) => k.startsWith("daily:"))) {
    void refreshBadgeFromStorage();
  }
});

startAutoPoller();
