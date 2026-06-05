import type { ContentSite } from "../messages";

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function isStreaming(el: Element): boolean {
  return el.getAttribute("data-is-streaming") === "true";
}

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
  collectElements: () => Element[]
): void {
  const seenIds = new Set<string>();
  const pending = new Map<
    string,
    { el: Element; timer: ReturnType<typeof setTimeout> }
  >();

  const flush = (el: Element, messageId: string) => {
    const text = el.textContent?.trim() ?? "";
    if (!text || text.length < 20 || seenIds.has(messageId)) return;
    seenIds.add(messageId);
    sendTrackedMessage({
      type: "ASSISTANT_MESSAGE",
      text,
      site,
      messageId,
    });
  };

  const scan = () => {
    for (const el of collectElements()) {
      if (isStreaming(el)) continue;
      const text = el.textContent?.trim() ?? "";
      if (text.length < 20) continue;

      const messageId =
        el.getAttribute("data-message-id") ??
        el.getAttribute("data-testid") ??
        simpleHash(`${site}:${text.slice(0, 500)}:${text.length}`);

      if (seenIds.has(messageId)) continue;

      const existing = pending.get(messageId);
      if (existing) clearTimeout(existing.timer);

      pending.set(messageId, {
        el,
        timer: setTimeout(() => {
          pending.delete(messageId);
          if (!document.contains(el) || isStreaming(el)) return;
          flush(el, messageId);
        }, 800),
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

  // Backup scan for SPAs / artifact UIs that stop mutating early
  window.setInterval(scan, 2500);

  // Re-scan after full page paint (existing chats)
  window.setTimeout(scan, 1500);
  window.setTimeout(scan, 4000);
}
