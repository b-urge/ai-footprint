import type { ContentSite } from "../messages";
import { turnIdForElement } from "./turnCollector";
import { hasSeenTurn, markTurnSeen } from "../shared/seenTurns";

function sendTrackedMessage(
  payload: {
    type: "ASSISTANT_MESSAGE";
    text: string;
    site: ContentSite;
    messageId: string;
  }
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(payload, (res) => {
        resolve(!chrome.runtime.lastError && res?.ok === true);
      });
    } catch {
      resolve(false);
    }
  });
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

    const ok = await sendTrackedMessage({
      type: "ASSISTANT_MESSAGE",
      text,
      site,
      messageId,
    });
    if (ok) {
      flushedLocal.add(messageId);
      await markTurnSeen(messageId);
    }
  };

  const scan = () => {
    for (const el of collectTurns()) {
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
  window.setTimeout(scan, 2000);
}
