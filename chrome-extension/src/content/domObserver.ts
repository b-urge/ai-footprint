import type { ContentSite } from "../messages";
import {
  isStreamingTurn,
  turnIdForElement,
} from "./turnCollector";
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
    // Extension context invalidated after reload — ignore
  }
}

export function startAssistantObserver(
  site: ContentSite,
  collectTurns: () => Element[]
): void {
  const pendingLocal = new Set<string>();
  const pending = new Map<
    string,
    { el: Element; timer: ReturnType<typeof setTimeout> }
  >();

  const flush = async (el: Element, messageId: string) => {
    const text = el.textContent?.trim() ?? "";
    if (!text || text.length < 20) return;
    if (pendingLocal.has(messageId)) return;
    if (await hasSeenTurn(messageId)) return;

    pendingLocal.add(messageId);
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
      if (text.length < 20) continue;

      const messageId = turnIdForElement(el, site);
      if (pendingLocal.has(messageId)) continue;

      const existing = pending.get(messageId);
      if (existing) clearTimeout(existing.timer);

      pending.set(messageId, {
        el,
        timer: setTimeout(() => {
          pending.delete(messageId);
          if (!document.contains(el) || isStreamingTurn(el)) return;
          void flush(el, messageId);
        }, 900),
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

  window.setInterval(scan, 3000);
  window.setTimeout(scan, 2000);
}
