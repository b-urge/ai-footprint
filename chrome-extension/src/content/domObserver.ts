import type { ContentSite } from "../messages";
import { isStreamingTurn, turnIdForElement } from "./turnCollector";
import { hasSeenTurn, markTurnSeen } from "../shared/seenTurns";

function sendTrackedMessage(payload: {
  type: "ASSISTANT_MESSAGE";
  text: string;
  site: ContentSite;
  messageId: string;
}): void {
  try {
    chrome.runtime.sendMessage(payload, () => {
      void chrome.runtime.lastError;
    });
  } catch {
    // Extension reloaded — ignore
  }
}

export function startAssistantObserver(
  site: ContentSite,
  collectTurns: () => Element[]
): void {
  const flushedLocal = new Set<string>();
  const pending = new Map<
    string,
    { el: Element; timer: ReturnType<typeof setTimeout> }
  >();

  const flush = async (el: Element, messageId: string) => {
    const text = el.textContent?.trim() ?? "";
    if (!text || text.length < 15) return;
    if (flushedLocal.has(messageId)) return;
    if (await hasSeenTurn(messageId)) return;

    flushedLocal.add(messageId);
    await markTurnSeen(messageId);
    sendTrackedMessage({
      type: "ASSISTANT_MESSAGE",
      text,
      site,
      messageId,
    });
  };

  const scan = () => {
    for (const el of collectTurns()) {
      if (isStreamingTurn(el)) continue;

      const text = el.textContent?.trim() ?? "";
      if (text.length < 15) continue;

      const messageId = turnIdForElement(el, site);
      if (flushedLocal.has(messageId)) continue;

      const existing = pending.get(messageId);
      if (existing) clearTimeout(existing.timer);

      pending.set(messageId, {
        el,
        timer: setTimeout(() => {
          pending.delete(messageId);
          if (!document.contains(el)) return;
          void flush(el, messageId);
        }, 1000),
      });
    }
  };

  scan();
  const observer = new MutationObserver(() => scan());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  window.setInterval(scan, 2500);
  window.setTimeout(scan, 1500);
  window.setTimeout(scan, 4000);
}
